import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

type Lang = 'he' | 'ar' | 'en';
type TimeOfDay = 'morning' | 'evening';

const MESSAGES: Record<TimeOfDay, Record<Lang, { title: string; body: string }>> = {
  morning: {
    he: { title: 'בוקר טוב 💜', body: 'את חזקה. אנחנו כאן בשבילך.' },
    ar: { title: 'صباح الخير 💜', body: 'أنتِ قوية. نحن هنا من أجلك.' },
    en: { title: 'Good morning 💜', body: 'You are strong. We are here for you.' },
  },
  evening: {
    he: { title: 'ערב טוב 💜', body: 'תני לעצמך מנוחה. אנחנו כאן בכל עת.' },
    ar: { title: 'مساء الخير 💜', body: 'أعطي نفسك راحة. نحن هنا في أي وقت.' },
    en: { title: 'Good evening 💜', body: 'Give yourself rest. We are here anytime.' },
  },
};

serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  const expectedSecret = `Bearer ${Deno.env.get('CRON_SECRET')}`;
  if (authHeader !== expectedSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const hour = new Date().getUTCHours();
  const timeOfDay: TimeOfDay = hour < 12 ? 'morning' : 'evening';

  const { data: targets, error } = await supabase
    .from('push_notification_targets')
    .select('id, push_token, lang');

  if (error || !targets) {
    return new Response(JSON.stringify({ error: error?.message }), { status: 500 });
  }

  const messages = targets.map(({ push_token, lang }) => {
    const langKey = (['he', 'ar', 'en'].includes(lang) ? lang : 'en') as Lang;
    const content = MESSAGES[timeOfDay][langKey];
    return {
      to: push_token,
      title: content.title,
      body: content.body,
      sound: 'default',
      data: { type: 'daily_support', timeOfDay },
    };
  });

  const results = [];
  const batchSize = 100;
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(batch),
    });
    results.push(await response.json());
  }

  console.log(`Sent ${messages.length} ${timeOfDay} notifications`);
  return new Response(
    JSON.stringify({ sent: messages.length, timeOfDay, results }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
