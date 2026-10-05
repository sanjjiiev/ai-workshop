-- ─────────────────────────────────────────────────────────────────────────────
-- NxtWave AI Workshop · Dummy Seed Data
-- Run this AFTER 001_initial_schema.sql in Supabase SQL Editor
-- Creates realistic referral chains so the leaderboard + stats are populated
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Tier-1: Top Referrers (no referred_by — they came organically) ────────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Priya Suresh',    'priya.suresh@srmist.edu.in',    '+91-9876543210', 'SRM Institute of Science and Technology', '4th Year', 'chatbot',
   'PRI-A7B3C2D1', NULL,
   'Priya, a final-year SRM student diving into AI chatbots — you are exactly the kind of builder this session was made for. In 60 minutes you will go from zero to a working Gemini-powered assistant. Let''s ship it! 🚀',
   now() - interval '6 days'),

  ('Rahul Krishnan',  'rahul.k@bits-pilani.ac.in',     '+91-9123456789', 'BITS Pilani',                             '4th Year', 'automation',
   'RAH-E5F6G7H8', NULL,
   'Rahul, BITS Pilani''s AI community is already legendary — and you''re about to add another chapter. Building an AI automation agent in 60 minutes sounds ambitious. By the end, you will have proven it is not. 💡',
   now() - interval '6 days'),

  ('Sneha Menon',     'sneha.m@nitk.ac.in',            '+91-9988776655', 'NIT Surathkal',                          '3rd Year', 'vision',
   'SNE-I9J0K1L2', NULL,
   'Sneha, from NIT Surathkal — you picked the Image AI track and that is a bold choice. You are about to build something that can literally see and understand the world. See you on the inside! 👁️',
   now() - interval '5 days'),

  ('Arjun Mehta',     'arjun.m@iitb.ac.in',            '+91-9001234567', 'IIT Bombay',                             '4th Year', 'generator',
   'ARJ-M3N4O5P6', NULL,
   'Arjun, IIT Bombay and AI text generation — the combination is scary good. In this session, you will build a real content generator that you can put on your GitHub immediately after. Let''s go! ✍️',
   now() - interval '5 days'),

  ('Kavya Patel',     'kavya.p@bitshyderabad.in',      '+91-9871234560', 'BITS Hyderabad',                         '3rd Year', 'chatbot',
   'KAV-Q7R8S9T0', NULL,
   'Kavya, the fact that you are here as a 3rd year from BITS Hyderabad tells me you are already thinking two steps ahead of your peers. Building an AI chatbot tonight will give you a project to talk about in every interview this season. 🔥',
   now() - interval '5 days'),

  ('Vikram Nair',     'vikram.n@amrita.edu',           '+91-9765432109', 'Amrita Vishwa Vidyapeetham',             '4th Year', 'automation',
   'VIK-U1V2W3X4', NULL,
   'Vikram, automation agents are the most in-demand skill right now, and you are about to build one from scratch tonight. Amrita to the world — let''s show them what you''ve got! ⚡',
   now() - interval '4 days'),

  ('Divya Sharma',    'divya.s@vit.ac.in',             '+91-9654321098', 'VIT Vellore',                            '4th Year', 'vision',
   'DIV-Y5Z6A7B8', NULL,
   'Divya, VIT Vellore has produced some incredible AI talent and you are about to join that list. Image AI is a superpower — tonight you will build something that can classify, caption and understand visual data. Excited for you! 🎯',
   now() - interval '4 days'),

  ('Aditya Reddy',    'aditya.r@iiit.ac.in',           '+91-9543210987', 'IIIT Hyderabad',                        '4th Year', 'chatbot',
   'ADI-C9D0E1F2', NULL,
   'Aditya, IIIT Hyderabad is where some of the best NLP researchers in India come from. You''re building an AI chatbot tonight — and given your background, I have a feeling you will ask questions that stump even the host. See you there! 🤖',
   now() - interval '3 days'),

  ('Meera Joshi',     'meera.j@manipal.edu',           '+91-9432109876', 'Manipal Institute of Technology',        '3rd Year', 'generator',
   'MEE-G3H4I5J6', NULL,
   'Meera, a 3rd year from Manipal who chose the Text Generator track — smart move. You are going to have a live, portfolio-ready AI project by the end of tonight''s session. Let''s build! ✨',
   now() - interval '3 days'),

  ('Siddharth Kumar',  'siddharth.k@nitw.ac.in',       '+91-9321098765', 'NIT Warangal',                          '4th Year', 'automation',
   'SID-K7L8M9N0', NULL,
   'Siddharth, NIT Warangal is no joke — and neither is the automation agent you''re about to build. In 60 minutes you will have a working multi-step AI workflow that most developers take weeks to build. 🏆',
   now() - interval '2 days');


-- ── Tier-2: Referred by Priya (10 referrals → 👑 Legend tier) ────────────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Ananya Singh',    'ananya.s@srmist.edu.in',  '+91-9111111111', 'SRM Institute of Science and Technology', '4th Year', 'chatbot',    'ANA-P1Q2R3S4', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 18 hours'),
  ('Rohit Das',       'rohit.d@srmist.edu.in',   '+91-9111111112', 'SRM Institute of Science and Technology', '3rd Year', 'generator',  'ROH-T5U6V7W8', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 16 hours'),
  ('Pooja Rajan',     'pooja.r@srmist.edu.in',   '+91-9111111113', 'SRM Institute of Science and Technology', '4th Year', 'vision',     'POO-X9Y0Z1A2', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 14 hours'),
  ('Karan Verma',     'karan.v@srmist.edu.in',   '+91-9111111114', 'SRM Institute of Science and Technology', '4th Year', 'automation', 'KAR-B3C4D5E6', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 12 hours'),
  ('Lakshmi Iyer',    'lakshmi.i@srmist.edu.in', '+91-9111111115', 'SRM Institute of Science and Technology', '3rd Year', 'chatbot',    'LAK-F7G8H9I0', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 10 hours'),
  ('Pranav Gupta',    'pranav.g@srmist.edu.in',  '+91-9111111116', 'SRM Institute of Science and Technology', '4th Year', 'generator',  'PRA-J1K2L3M4', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 8 hours'),
  ('Shreya Nair',     'shreya.n@srmist.edu.in',  '+91-9111111117', 'SRM Institute of Science and Technology', '3rd Year', 'vision',     'SHR-N5O6P7Q8', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 6 hours'),
  ('Varun Pillai',    'varun.p@srmist.edu.in',   '+91-9111111118', 'SRM Institute of Science and Technology', '4th Year', 'chatbot',    'VAR-R9S0T1U2', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 4 hours'),
  ('Nisha Kulkarni',  'nisha.k@srmist.edu.in',   '+91-9111111119', 'SRM Institute of Science and Technology', '4th Year', 'automation', 'NIS-V3W4X5Y6', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 2 hours'),
  ('Tejas Bhat',      'tejas.b@srmist.edu.in',   '+91-9111111120', 'SRM Institute of Science and Technology', '3rd Year', 'chatbot',    'TEJ-Z7A8B9C0', 'PRI-A7B3C2D1', NULL, now() - interval '5 days 1 hour');

-- ── Tier-2: Referred by Rahul (7 referrals → 👑 Legend approaching) ──────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Dhruv Sharma',    'dhruv.s@bits-pilani.ac.in',   '+91-9222222221', 'BITS Pilani', '4th Year', 'automation', 'DHR-D1E2F3G4', 'RAH-E5F6G7H8', NULL, now() - interval '5 days 17 hours'),
  ('Ishita Roy',      'ishita.r@bits-pilani.ac.in',  '+91-9222222222', 'BITS Pilani', '3rd Year', 'chatbot',    'ISH-H5I6J7K8', 'RAH-E5F6G7H8', NULL, now() - interval '5 days 15 hours'),
  ('Nikhil Agarwal',  'nikhil.a@bits-pilani.ac.in',  '+91-9222222223', 'BITS Pilani', '4th Year', 'generator',  'NIK-L9M0N1O2', 'RAH-E5F6G7H8', NULL, now() - interval '5 days 13 hours'),
  ('Tanvi Jain',      'tanvi.j@bits-pilani.ac.in',   '+91-9222222224', 'BITS Pilani', '4th Year', 'vision',     'TAN-P3Q4R5S6', 'RAH-E5F6G7H8', NULL, now() - interval '5 days 11 hours'),
  ('Abhinav Rao',     'abhinav.r@bits-pilani.ac.in', '+91-9222222225', 'BITS Pilani', '3rd Year', 'automation', 'ABH-T7U8V9W0', 'RAH-E5F6G7H8', NULL, now() - interval '5 days 9 hours'),
  ('Riya Malhotra',   'riya.m@bits-pilani.ac.in',    '+91-9222222226', 'BITS Pilani', '4th Year', 'chatbot',    'RIY-X1Y2Z3A4', 'RAH-E5F6G7H8', NULL, now() - interval '5 days 7 hours'),
  ('Chirag Patel',    'chirag.p@bits-pilani.ac.in',  '+91-9222222227', 'BITS Pilani', '3rd Year', 'generator',  'CHI-B5C6D7E8', 'RAH-E5F6G7H8', NULL, now() - interval '5 days 5 hours');

-- ── Tier-2: Referred by Sneha (5 referrals → 🚀 Pro tier) ────────────────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Aryan Hegde',     'aryan.h@nitk.ac.in', '+91-9333333331', 'NIT Surathkal', '4th Year', 'vision',     'ARY-F9G0H1I2', 'SNE-I9J0K1L2', NULL, now() - interval '4 days 20 hours'),
  ('Deepika Kamath',  'deepika.k@nitk.ac.in','+91-9333333332', 'NIT Surathkal', '3rd Year', 'chatbot',    'DEE-J3K4L5M6', 'SNE-I9J0K1L2', NULL, now() - interval '4 days 18 hours'),
  ('Suresh Bhat',     'suresh.b@nitk.ac.in', '+91-9333333333', 'NIT Surathkal', '4th Year', 'automation', 'SUR-N7O8P9Q0', 'SNE-I9J0K1L2', NULL, now() - interval '4 days 16 hours'),
  ('Pallavi Shetty',  'pallavi.s@nitk.ac.in','+91-9333333334', 'NIT Surathkal', '4th Year', 'generator',  'PAL-R1S2T3U4', 'SNE-I9J0K1L2', NULL, now() - interval '4 days 14 hours'),
  ('Ganesh Naik',     'ganesh.n@nitk.ac.in', '+91-9333333335', 'NIT Surathkal', '3rd Year', 'vision',     'GAN-V5W6X7Y8', 'SNE-I9J0K1L2', NULL, now() - interval '4 days 12 hours');

-- ── Tier-2: Referred by Arjun (5 referrals → 🚀 Pro tier) ────────────────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Ishaan Desai',    'ishaan.d@iitb.ac.in', '+91-9444444441', 'IIT Bombay', '4th Year', 'generator',  'ISN-Z9A0B1C2', 'ARJ-M3N4O5P6', NULL, now() - interval '4 days 19 hours'),
  ('Trisha Kapoor',   'trisha.k@iitb.ac.in', '+91-9444444442', 'IIT Bombay', '3rd Year', 'chatbot',    'TRI-D3E4F5G6', 'ARJ-M3N4O5P6', NULL, now() - interval '4 days 17 hours'),
  ('Yash Tiwari',     'yash.t@iitb.ac.in',   '+91-9444444443', 'IIT Bombay', '4th Year', 'vision',     'YAS-H7I8J9K0', 'ARJ-M3N4O5P6', NULL, now() - interval '4 days 15 hours'),
  ('Ritika Bansal',   'ritika.b@iitb.ac.in', '+91-9444444444', 'IIT Bombay', '4th Year', 'automation', 'RIT-L1M2N3O4', 'ARJ-M3N4O5P6', NULL, now() - interval '4 days 13 hours'),
  ('Kunal Mehta',     'kunal.m@iitb.ac.in',  '+91-9444444445', 'IIT Bombay', '3rd Year', 'generator',  'KUN-P5Q6R7S8', 'ARJ-M3N4O5P6', NULL, now() - interval '4 days 11 hours');

-- ── Tier-2: Referred by Kavya (3 referrals → 🏅 Hustler tier) ────────────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Rohan Chandra',   'rohan.c@bitshyderabad.in',  '+91-9555555551', 'BITS Hyderabad', '4th Year', 'chatbot',    'RON-T9U0V1W2', 'KAV-Q7R8S9T0', NULL, now() - interval '4 days 10 hours'),
  ('Swati Reddy',     'swati.r@bitshyderabad.in',  '+91-9555555552', 'BITS Hyderabad', '3rd Year', 'automation', 'SWA-X3Y4Z5A6', 'KAV-Q7R8S9T0', NULL, now() - interval '4 days 8 hours'),
  ('Mihir Shah',      'mihir.s@bitshyderabad.in',  '+91-9555555553', 'BITS Hyderabad', '4th Year', 'vision',     'MIH-B7C8D9E0', 'KAV-Q7R8S9T0', NULL, now() - interval '4 days 6 hours');

-- ── Tier-2: Referred by Vikram (3 referrals → 🏅 Hustler tier) ───────────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Aishwarya Nair',  'aishwarya.n@amrita.edu', '+91-9666666661', 'Amrita Vishwa Vidyapeetham', '4th Year', 'automation', 'AIS-F1G2H3I4', 'VIK-U1V2W3X4', NULL, now() - interval '3 days 22 hours'),
  ('Santhosh Kumar',  'santhosh.k@amrita.edu',  '+91-9666666662', 'Amrita Vishwa Vidyapeetham', '3rd Year', 'chatbot',    'SAN-J5K6L7M8', 'VIK-U1V2W3X4', NULL, now() - interval '3 days 20 hours'),
  ('Bhavana Pillai',  'bhavana.p@amrita.edu',   '+91-9666666663', 'Amrita Vishwa Vidyapeetham', '4th Year', 'generator',  'BHA-N9O0P1Q2', 'VIK-U1V2W3X4', NULL, now() - interval '3 days 18 hours');

-- ── Tier-2: Referred by Divya (1 referral → 🎁 Starter tier) ────────────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Harshita Mishra', 'harshita.m@vit.ac.in', '+91-9777777771', 'VIT Vellore', '4th Year', 'vision', 'HAR-R3S4T5U6', 'DIV-Y5Z6A7B8', NULL, now() - interval '3 days 16 hours');

-- ── Tier-2: Referred by Aditya (2 referrals → 🎁 Starter tier) ──────────────
INSERT INTO public.registrations
  (name, email, phone, college, year, track, referral_code, referred_by, ai_welcome_message, created_at)
VALUES
  ('Sameer Qureshi',  'sameer.q@iiit.ac.in', '+91-9888888881', 'IIIT Hyderabad', '4th Year', 'chatbot',    'SAM-V7W8X9Y0', 'ADI-C9D0E1F2', NULL, now() - interval '2 days 22 hours'),
  ('Lavanya Bose',    'lavanya.b@iiit.ac.in', '+91-9888888882', 'IIIT Hyderabad', '3rd Year', 'automation', 'LAV-Z1A2B3C4', 'ADI-C9D0E1F2', NULL, now() - interval '2 days 20 hours');

-- ── Verify the leaderboard after seeding ─────────────────────────────────────
-- SELECT * FROM get_leaderboard(10);
