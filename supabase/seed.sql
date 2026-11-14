-- Pass ON Seed Data for Supabase
-- Insert Initial Colleges
INSERT INTO colleges (id, slug, name, short_name, location, category, is_active, branches, description)
VALUES 
  ('mait', 'mait', 'Maharaja Agrasen Institute of Technology', 'MAIT', 'Rohini, Delhi', 'Engineering', TRUE, '["CSE", "IT", "ECE", "AIML", "EEE", "ME"]', 'Premier GGSIPU engineering college situated in PSP Area, Plot No. 1, Sector 22, Rohini.'),
  ('msit', 'msit', 'Maharaja Surajmal Institute of Technology', 'MSIT', 'Janakpuri, New Delhi', 'Engineering', TRUE, '["CSE", "IT", "ECE", "EEE"]', 'Renowned engineering college located in C-4 Janakpuri, New Delhi.'),
  ('bvcoe', 'bvcoe', 'Bharati Vidyapeeth''s College of Engineering', 'BVCOE / BVP', 'Paschim Vihar, New Delhi', 'Engineering', TRUE, '["CSE", "IT", "ECE", "EEE", "ICE"]', 'A-4 Paschim Vihar, Rohtak Road campus known for engineering and technical excellence.'),
  ('bpit', 'bpit', 'Bhagwan Parshuram Institute of Technology', 'BPIT', 'Rohini, Delhi', 'Engineering', TRUE, '["CSE", "IT", "ECE", "EEE"]', 'Located in Sector 17, Rohini, Delhi, providing comprehensive undergraduate engineering education.'),
  ('gtbit', 'gtbit', 'Guru Tegh Bahadur Institute of Technology', 'GTBIT', 'Rajouri Garden, New Delhi', 'Engineering', TRUE, '["CSE", "IT", "ECE", "EEE"]', 'Sikh minority institution located at G-8 Area, Rajouri Garden, New Delhi.'),
  ('adgitm', 'adgitm', 'Dr. Akhilesh Das Gupta Institute of Technology & Management', 'ADGITM', 'Shastri Park, New Delhi', 'Engineering', TRUE, '["CSE", "IT", "ECE", "ME", "Civil", "AI&DS", "AIML"]', 'FC-26, Pandav Nagar Road, Shastri Park, offering modern diverse B.Tech specializations.'),
  ('vips-tc', 'vips-tc', 'Vivekananda Institute of Professional Studies — Technical Campus', 'VIPS-TC', 'Pitampura, New Delhi', 'Engineering', TRUE, '["CSE", "AI&ML", "AI&DS", "IIOT"]', 'AU Block, Outer Ring Road, Pitampura, focused on cutting-edge computer sciences & emerging technologies.'),
  ('hmr', 'hmr', 'HMR Institute of Technology & Management', 'HMR', 'Hameedpur, New Delhi', 'Engineering', TRUE, '["CSE", "IT", "ECE"]', 'Established in Hameedpur, Delhi, offering undergraduate courses in core engineering fields.'),
  ('gtb4cec', 'gtb4cec', 'Guru Tegh Bahadur 4th Centenary Engineering College', 'GTB4CEC', 'New Delhi', 'Engineering', TRUE, '["CSE", "IT", "ECE"]', 'Affiliated technical college in New Delhi fostering engineering innovation.')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  location = EXCLUDED.location,
  branches = EXCLUDED.branches;

-- Insert Initial Categories
INSERT INTO categories (id, name, slug, icon, description, display_order, is_active, subcategories)
VALUES
  ('academic', 'Academic Materials', 'academic-materials', 'BookOpen', 'Engineering textbooks, semester reference books, handwritten topper notes, and exam prep papers.', 1, TRUE, '["Engineering Textbooks & Reference Books", "Handwritten Notes & Study Sheets", "Printed Study Materials", "Exam Preparation & PYQ Books"]'),
  ('lab-equipment', 'Engineering & Lab Equipment', 'engineering-lab-equipment', 'Wrench', 'Scientific calculators, lab coats, drawing boards, sheet holders, calipers, multimeters & Arduino kits.', 2, TRUE, '["Scientific Calculators", "Lab Coats", "Drawing Sheets & Drawing Instruments", "Sheet Holders & Drawing Boards", "Vernier Calipers & Micrometers", "Multimeters & Breadboards", "Arduino Kits & Electronics Components", "Lab Accessories & Project Materials"]'),
  ('electronics', 'Electronics & Accessories', 'electronics-accessories', 'Laptop', 'Laptops, monitors, mechanical keyboards, mice, adapters, laptop stands, headphones & USB hubs.', 3, TRUE, '["Laptops & Monitors", "Keyboards & Mice", "Chargers & Adapters", "Headphones & Earphones", "Laptop Stands & Risers", "USB Hubs & Cables"]'),
  ('hostel-essentials', 'Hostel & Everyday Essentials', 'hostel-everyday-essentials', 'Home', 'Hostel storage boxes, desk lamps, heavy-duty extension boards, door locks, hangers, bags & umbrellas.', 4, TRUE, '["Storage Boxes & Organizers", "Desk Lamps", "Extension Boards", "Locks & Hangers", "Bags & Backpacks", "Umbrellas", "Desk Organizers & Stationery"]')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  subcategories = EXCLUDED.subcategories;
