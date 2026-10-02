# InwGateway - AI Operating System & Tool-First Guidelines

> **กฎเหล็กของระบบ (Core Invariant):**
> ก่อนเริ่มทำภารกิจใดๆ หรือระหว่างส่งต่องาน ให้ยึดหลัก **"Tool-First & Context Economy"** เสมอ ห้ามคาดเดาโค้ดเอง หรือโยนไฟล์ทั้งก้อนเข้า Context โดยไม่จำเป็น

---

## ⚡ 1. กฎการเริ่มต้นงาน (Tool-First Discovery Phase)
เมื่อได้รับคำสั่งจากผู้ใช้ ให้ปฏิบัติตามลำดับขั้นตอนนี้เสมอ:
1. **สำรวจเครื่องมือก่อนลงมือ:** ค้นหาหรือตรวจสอบว่ามี Tool ใดที่ช่วยให้ทำงานนี้ได้เร็วและแม่นยำขึ้นหรือไม่ ผ่าน `search_tools` หรือ InwGateway Catalog (ปัจจุบันมี 201 Tools ครอบคลุม Vibe Code Guardian, LINE OA Engine, Presentation Studio, Government Poster Pipeline, Advanced GAS WebApp Ops, Headroom Context Compression, Engineering Excellence, Windows Native Grep, Clasp Deployment Manager, Runtime Audit, Godkiller Quality Gate, Local Files, Windows, Browser, Code Intel, Design Memory, Multi-Agent, Database, Live Preview ฯลฯ)
2. **ห้ามอ่านไฟล์ทั้งก้อนเด็ดขาด:** 
   - หากต้องการดูโครงสร้างฟังก์ชัน ให้ใช้ `get_file_outline` หรือ `find_symbol_definition`
   - หากต้องการอ่านโค้ด ให้ใช้ `read_file_chunk` อ่านเฉพาะช่วง 50–100 บรรทัดที่เกี่ยวข้องเท่านั้น

---

## 🎨 2. กฎการออกแบบและสร้างสรรค์ (Design Memory First)
เมื่อต้องสร้างรูปภาพ, ทำโปสเตอร์, หรือเขียนหน้าตา UI:
1. **เช็คสไตล์เดิมก่อนเสมอ:** เรียกใช้ `list_design_presets` หรือ `get_design_preset` เพื่อดูว่ามี Visual DNA / Palette สีเดิมที่ผู้ใช้บันทึกไว้หรือไม่
2. **คุมโทนงานใหม่ให้ตรงปก:** ใช้ `apply_design_preset_to_prompt` ดึงสูตรสไตล์เดิมมาผสมกับ Prompt ใหม่ เพื่อให้งานออกมาคุมโทนเดิม 100%
3. **บันทึกงานที่ผู้ใช้ถูกใจ:** เมื่อผู้ใช้ชมว่าชอบดีไซน์ใด ให้ใช้ `save_design_preset` หรือ `extract_and_save_ui_dna` บันทึกไว้ในคลังทันที

---

## 📦 3. กฎการรันคำสั่งหลายขั้นตอน (Multi-Tool Batching)
เมื่อต้องรันงานที่มีหลายขั้นตอนต่อเนื่องกัน (เช่น อ่านสเปก $\rightarrow$ รันสคริปต์ $\rightarrow$ เช็คผล):
- **ห้ามส่งกลับมาถามทีละรอบ:** ให้วางแผนเป็น DAG และรวมคำสั่งส่งผ่าน `tool_batch` ให้ทำงานจบในรอบเดียว เพื่อลดการสิ้นเปลืองรอบการสนทนา (Conversation Turns)

---

## 💾 4. กฎการส่งต่องานและจำสถานะ (Session Preservation)
- เมื่อจบงานสำคัญหรือก่อนปิดห้องแชท ให้ใช้ `session_checkpoint_save` บันทึกสถานะงานและ Next Steps ไว้เสมอ
- เมื่อเริ่มรอบการทำงานใหม่ ให้ใช้ `session_checkpoint_restore` เพื่อดึงบริบทเดิมกลับมาทำต่อได้ทันทีโดยไม่ต้องเริ่มต้นทำความเข้าใจโปรเจกต์ใหม่

---

## 🧪 5. กฎการทดสอบระบบอัตโนมัติ (Autonomous Quality & Auto-Testing)
เมื่อมีการเขียนหรือแก้ไขโค้ดในโปรเจกต์:
1. **รันเทสต์ตัวเองอัตโนมัติเสมอ:** หลังแก้โค้ดเสร็จ ให้รันเทสต์หรือใช้ `run_affected_tests` / `start_autonomous_watchdog` ทันทีเพื่อตรวจเช็ค Syntax และความถูกต้องเบื้องต้นโดยไม่ต้องรอให้ผู้ใช้สั่ง
2. **ตรวจเช็คผลกระทบ (Impact Analysis):** ตรวจสอบว่าโค้ดที่แก้ไขไม่ส่งผลให้ฟังก์ชันอื่นในระบบพัง ผ่าน `git_impact_analysis`

---

## 📱 6. กฎการออกแบบ Responsive และความประณีตของ UI (Pixel-Perfect Guardrails)
เมื่อต้องเขียนโค้ด HTML/CSS, ปรับแต่งหน้าเว็บ, หรือออกแบบ UI ต้องยึดหลักมาตรฐานดังนี้:
1. **ป้องกันการล้นจอและตกขอบ (Zero Horizontal Overflow):**
   - ห้ามมี Scrollbar แนวนอนหลุดออกมาเด็ดขาด (`overflow-x-hidden`)
   - หลีกเลี่ยงการกำหนดขนาดเป็นพิกเซลแบบคงที่ (Fixed Width เช่น `width: 800px`) ให้ใช้ `max-w-*`, `%`, `flex`, หรือ `grid` ที่ปรับตามขนาดหน้าจออัตโนมัติ
2. **การจัดวางประโยคและตัดข้อความ (Text Clamping & Word Wrapping):**
   - ข้อความทุกส่วนต้องไม่ทะลุกรอบกล่อง (ใช้ `break-words`, `overflow-wrap: anywhere` หรือ `line-clamp` สำหรับข้อความยาว)
   - จัดระยะบรรทัด (`line-height`) และช่องไฟ (`padding/margin`) ให้สบายตา ไม่เบียดชิดขอบการ์ด
3. **มาตรฐานขนาดปุ่มและการกด (Touch Target & Button Sizing):**
   - ปุ่มต้องมีขนาดสมดุลกับหน้าจอ ไม่เล็กจนกดบนมือถือยาก (ความสูงอย่างน้อย $44\text{px}$ บนมือถือ หรือมี Touch Area ที่เหมาะสม)
   - มี Padding ที่ได้สัดส่วน พร้อมสถานะ Hover / Active / Focus State ให้ผู้ใช้เห็นชัดเจน
4. **ตรวจสอบทุกขนาดหน้าจอ (Multi-Viewport Audit):**
   - ตรวจเช็คความสวยงามบน 3 หน้าจอหลักเสมอ: **มือถือ (375px)**, **แท็บเล็ต (768px)**, และ **เดสก์ท็อป (1440px)** ผ่าน `browser_responsive_audit`

---

## 💰 7. กฎการบริหารและประหยัด Token ขั้นสูงสุด (Hyper Token Economy)
เพื่อให้การใช้งาน Token มีประสิทธิภาพสูงสุดและประหยัดโควตา ให้ปฏิบัติตามหลักการดังนี้:
1. **งดเว้นการโหลดไฟล์และเขียนโค้ดทั้งก้อน (Surgical Changes Only):**
   - ห้ามแสดงหรือเขียนโค้ดทั้งไฟล์ซ้ำ ให้ใช้การแทนที่เฉพาะบรรทัดที่เปลี่ยนแปลงผ่าน `replace_file_content`
   - ใช้ `get_file_outline` และ `read_file_chunk` สแกนเฉพาะจุดที่เกี่ยวข้องเพื่อลดขนาด Input Token
2. **กรองข้อมูลในเครื่องก่อนส่งเข้า Context (In-Situ Pre-filtering):**
   - ห้ามส่งข้อมูลดิบขนาดใหญ่ (เช่น ข้อมูลดิบจาก Excel 1,000 แถว หรือ Log ก้อนใหญ่) เข้ามาใน Context
   - ให้สรุปหรือกรองเอาเฉพาะบรรทัดที่เป็นสาระสำคัญผ่าน Script ภายในเครื่องก่อนส่งผลลัพธ์ให้ AI
3. **ลดรอบบทสนทนาซ้ำซ้อน (Batch Execution over Ping-Pong):**
   - รวมคำสั่งย่อยที่มีขั้นตอนต่อเนื่องกันเป็น `tool_batch` เพื่อป้องกันไม่ให้ประวัติแชทสะสมบวมขึ้นทุกรอบ
4. **การสื่อสารที่กระชับและตรงจุด (Zero-Fluff Output):**
   - ตอบอย่างกระชับ ไม่อธิบายโค้ดเดิมที่ไม่เกี่ยวข้องซ้ำ เน้นรายงานผลลัพธ์ที่กระทำและข้อเสนอแนะที่ชัดเจน

---

## 🚀 8. กฎการจัดการ Google Apps Script & Clasp (GAS Ecosystem)
เมื่อทำงานกับโปรเจกต์ Google Workspace หรือ Google Apps Script WebApp:
1. **การรวมไฟล์และ Deploy อัตโนมัติ:**
   - ใช้ `gas_webapp_html_bundler` รวมไฟล์ `Index.html`, `Css.html`, `Js.html` เป็นก้อนเดียวเพื่อพรีวิวหรือตรวจสอบโค้ด
   - ใช้ `gas_clasp_deploy_pipeline` เพื่อรันตรวจสอบ, Push และสร้าง Version Deployment จบในคำสั่งเดียว
2. **สูตรและการตั้งเวลา (Formulas & Triggers):**
   - ใช้ `google_sheets_formula_optimizer` สร้างสูตร `QUERY` หรือ `ARRAYFORMULA` แทนการใส่สูตรซ้ำทีละแถว
   - ใช้ `appsscript_trigger_manager` จัดการสร้างโค้ด Time-driven หรือ OnFormSubmit Triggers

---

## 🤖 9. กฎการกระจายงานคู่ขนาน (Multi-Agent Swarm Collaboration)
เมื่อพบภารกิจขนาดใหญ่ที่มีหลายองค์ประกอบ (เช่น วางโครงสร้าง + เขียนโค้ด + ออกแบบ UI + ทำเทสต์):
1. **แบ่งงานย่อยให้ชัดเจน:** ใช้ `dispatch_agent_team` มอบหมายงานให้ Agent ย่อยตามความเชี่ยวชาญ (Architect, Coder, QA Tester)
2. **ส่งต่องานอย่างแม่นยำ:** ใช้ `coordinate_agent_handoff` ในการส่งต่อตัวแปรและบริบท
3. **สรุปผลงานรวม:** รวมผลลัพธ์ชุดสุดท้ายด้วย `synthesize_team_results` ก่อนส่งมอบให้ผู้ใช้

---

## 📊 10. กฎการจัดการข้อมูลและพรีวิวสด (Data & Live UI Preview)
1. **การทดสอบระบบด้วย Mock Data:**
   - ใช้ `generate_mock_dataset` เสกข้อมูลจำลองที่สมจริง (JSON/CSV/SQL) เพื่อทดสอบระบบก่อนต่อฐานข้อมูลจริง
   - ใช้ `database_schema_visualizer` วาดภาพ ERD Diagram เพื่อตรวจความสัมพันธ์ของตาราง
2. **การตรวจดูหน้าตา UI สดๆ (Live Preview):**
   - เมื่อสร้างหรือแก้ไขหน้าเว็บ ให้เรนเดอร์ผลงานสดผ่าน `render_live_ui_preview` เพื่อเปิดดูหน้าตาจริงบนเบราว์เซอร์ที่ `http://localhost:3000/live_preview.html` ได้ทันที

---

## 🔍 11. กฎการสรุปและรีวิวโค้ดหลังเสร็จงาน (Post-Coding Concise Review)
เมื่อเขียนหรือแก้ไขโค้ดเสร็จสิ้นทุกครั้ง ต้องรายงานสรุปผลให้ผู้ใช้ทราบด้วยรูปแบบที่ **"สั้น กระชับ และเข้าใจง่ายที่สุด"** โดยครอบคลุม 4 ประเด็นสำคัญเสมอ:
1. 📍 **เขียน/แก้ส่วนไหน (Where):** ระบุชื่อไฟล์และฟังก์ชันที่เปลี่ยนแปลง/เพิ่มใหม่อย่างชัดเจน
2. ⚙️ **การทำงานเป็นอย่างไร (How it works):** อธิบายกลไกการทำงานสั้นๆ 1–2 ประโยค
3. 🎯 **ประโยชน์ที่ได้ & ผลลัพธ์ (Benefits & What to expect):** สิ่งที่ระบบทำได้เพิ่มขึ้น หรือผลลัพธ์ที่เปลี่ยนไปบนหน้าจอ
4. 🔄 **ผลกระทบต่อฟังก์ชันเดิม (Impact Analysis):** ระบุว่าฟังก์ชันใหม่กระทบ, เชื่อมโยง, หรือต้องปรับใช้ร่วมกับฟังก์ชันเดิมอย่างไร (เช่น "ทำงานร่วมกับฟังก์ชัน X โดยไม่กระทบการทำงานเดิม")
*(เน้นสรุปเป็น Bullet points สั้นๆ ไม่เยิ่นเย้อ)*

---

## 🏛️ 12. กฎวิศวกรรมขั้นสูงระดับปรมาจารย์ (Engineering Excellence & Matt Pocock Disciplines)
เมื่อเริ่มออกแบบ พัฒนา หรือรีแฟกเตอร์ระบบ ต้องยึดถือ 5 วินัยวิศวกรรมชั้นยอด:
1. **Strict Domain Modeling (Type-First & Impossible States):** ออกแบบ Entity Types และ Zod Schema ผ่าน `domain_model_guard` บังคับใช้ Discriminated Unions ห้ามสร้าง State ที่ขัดแย้งกันในระบบ
2. **Pure TDD Cycle (Red-Green-Refactor):** ควบคุมการเทสต์ผ่าน `tdd_cycle_runner` บังคับเขียน Test ให้ล้มเหลวก่อน (Red) เพื่อพิสูจน์ว่า Test ดักจับได้จริง ก่อนเขียนโค้ดให้ผ่าน (Green)
3. **Adversarial Edge-Case Hunter:** สแกนเค้นจุดเปราะบางด้วย `edge_case_hunter` ก่อนเริ่มเขียนเสมอ (Null/Undefined, Concurrency, Network Timeout, สระภาษาไทยหลุด)
4. **Micro-Step Safe Refactoring:** การรื้อโค้ดใหญ่ต้องวางแผนเป็นก้าวทีละมิลผ่าน `micro_refactor_stepper` รันเทสต์ตรวจสอบทุกการขยับ ป้องกันระบบพังรวดเดียว
5. **Architecture Decision Records (ADR):** บันทึกการตัดสินใจเชิงสถาปัตยกรรมสำคัญลงใน `docs/adr/` ด้วย `adr_manager` เพื่อสร้างหน่วยความจำระยะยาวให้โปรเจกต์

---

## 🗜️ 13. กฎการบีบอัดบริบทและการเรียนรู้ข้อผิดพลาดอัตโนมัติ (Headroom Context Compression & InwLearn)
เมื่อต้องจัดการข้อมูลขนาดใหญ่ หรือพบข้อผิดพลาดระหว่างปฏิบัติการ:
1. **SmartCrusher for Tabular/JSON:** เมื่อดึงข้อมูล JSON หรือ Google Sheets ปริมาณมาก ให้บีบอัดผ่าน `compact_json_crusher` เพื่อตัด Key ซ้ำซาก ประหยัด Token สูงสุด 90%
2. **Reversible Context (CCR Dehydration):** ผลลัพธ์คำสั่งหรือ Log ขนาดยาว ต้องทำการ Dehydrate บันทึกลง Disk ในเครื่องด้วย `ccr_payload_dehydrate` และส่งคืนเฉพาะ Preview + Cache ID โดย AI สามารถใช้ `ccr_payload_retrieve` ดึงเนื้อหาเฉพาะบรรทัดที่ต้องการได้เสมอ
3. **AST Code Skeleton Compactor:** ในการทำความเข้าใจไฟล์โค้ดขนาดใหญ่ ให้ใช้ `ast_code_skeleton_compactor` ยุบเนื้อหาฟังก์ชันเหลือเฉพาะ Signature และ Type โครงร่าง เพื่อประหยัดบริบท 95%
4. **Autonomous Mistake Mining (InwLearn):** เมื่อพบ Bug, ข้อจำกัดของระบบ (เช่น ปัญหา UTF-8 ใน PowerShell หรือ 403 Forbidden ใน Apps Script) ให้ใช้ `inw_learn_rule_miner` สกัดสาเหตุและกฎเหล็กบันทึกฝังลงใน `GEMINI.md` ทันทีเพื่อป้องกันไม่ให้เกิดซ้ำสอง

---

## 🎬 14. กฎการสร้างและควบคุมระบบสไลด์และวิดีโอนำเสนอ (Presentation Studio Ecosystem)
เมื่อทำงานกับระบบสไลด์นำเสนอ (HTML Web Presentations) และการแปลงเป็นวิดีโอ:
1. **การเรนเดอร์วิดีโอระดับสตูดิโอ (Studio Video Rendering):**
   - ใช้ `presentation_render_video` เรนเดอร์สไลด์ HTML เป็นวิดีโอ Full HD 1080p MP4 พร้อมดนตรีประกอบ (BGM) แบบตัดต่อสะอาด
   - ระบบจะคงแถบส่วนหัว (`.canva-top-bar`) และเนื้อหาสไลด์ไว้ แต่ซ่อนแถบควบคุมด้านล่าง (`.canva-bottom-player`) อัตโนมัติ เพื่อให้ได้ผลลัพธ์ระดับ Broadcast
2. **การรวมไฟล์เป็น Single-File ออฟไลน์ 100% (Standalone Packaging):**
   - ใช้ `presentation_bundle_standalone` สแกนและฝัง Assets ทั้งหมด (ภาพ, เสียง, ฟอนต์) เป็น Base64 ในไฟล์ `.html` เดียว เปิดดูได้ทุกเครื่องโดยไม่ต้องมี Local Server หรือเน็ต
3. **การตรวจสอบสไลด์และสินทรัพย์ (Deck Inspection & Audit):**
   - ใช้ `presentation_inspect_deck` ตรวจนับจำนวนสไลด์, คำนวณเวลารวมทั้งหมด และสแกนหารูปภาพที่ลิงก์หลุดหรือหาไฟล์ไม่เจอ ก่อนส่งมอบงานจริง

---

## 💬 15. กฎการเชื่อมต่อ LINE Official Account และระบบแจ้งเตือนอัจฉริยะ (LINE OA & Cross-Platform Synergy)
เมื่อพัฒนาระบบที่เกี่ยวข้องกับ LINE Official Account, Chatbot, หรือการรับแจ้งเรื่องผ่าน LINE:
1. **การออกแบบ Rich Menu และ Flow สนทนา (Rich Menu & FSM Engine):**
   - ใช้ `line_rich_menu_designer_and_builder` ออกแบบและกำหนดพิกัด Touch Action ของ Rich Menu อย่างแม่นยำ
   - ใช้ `line_conversation_fsm_generator` วางโครงสร้าง State Machine สำหรับบทสนทนาโต้ตอบ ป้องกันสถานะแชทค้าง
2. **การจัดการสื่อและพิกัดภูมิศาสตร์ (Media & Geo Boundary):**
   - ใช้ `gdrive_dual_channel_media_pipeline` รับภาพถ่ายและวิดีโอจาก LINE บันทึกตรงเข้า Google Drive พร้อมตั้งสิทธิ์ Public และดึง Thumbnail มาแสดงบน WebApp ทันที
   - ใช้ `thai_administrative_boundary_mapper` ถอดรหัสพิกัด GPS ละติจูด/ลองจิจูด เป็นชื่อตำบล อำเภอ และจังหวัดในประเทศไทยโดยอัตโนมัติ
3. **การตรวจสอบการซิงก์ข้ามระบบ (Cross-Sync Auditor):**
   - ใช้ `gas_sheet_cross_sync_auditor` ตรวจจับความไม่สอดคล้องของข้อมูลระหว่าง LINE Webhook กับชีตปลายทาง ป้องกันข้อมูลตกหล่น

---

## 🎨 16. กฎการสร้างโปสเตอร์และสื่อประชาสัมพันธ์ภาครัฐ (Public & Government Asset Studio)
เมื่อได้รับมอบหมายให้ออกแบบสื่อประชาสัมพันธ์ ป้ายประกาศ หรือโปสเตอร์ทางการ:
1. **มาตรฐานโปสเตอร์ราชการ (Gov Poster Full Pipeline):**
   - ใช้ `gov_poster_full_pipeline` วาง Layout โปสเตอร์ คุมโทนสี สัดส่วน และจัดวางตำแหน่งตราสัญลักษณ์อย่างถูกต้องตามระเบียบ
2. **การจัดการตราสัญลักษณ์และโลโก้ (Asset Transparency):**
   - ใช้ `image_make_transparent_logo` สกัดและตัดพื้นหลังตราสัญลักษณ์หรือโลโก้องค์กรให้โปร่งใสระดับ High-Res เพื่อนำไปซ้อนบนพื้นหลังได้อย่างกลมกลืน

---

## 📈 17. กฎการจัดการ WebApp รายงานและระบบตั๋วขั้นสูง (Advanced Ticket & Reporting Ops)
สำหรับ WebApp ระบบรายงานข้อร้องเรียนและการติดตามสถานะงานซ่อม/บริการ:
1. **ระบบรายงานผู้บริหารและสถิติ (Executive Reports & Analytics):**
   - ใช้ `webapp_daily_report_generator`, `webapp_weekly_report_compiler`, และ `webapp_executive_a4_builder` สรุปรายงานรายวัน รายสัปดาห์ และรายงานพิมพ์ขนาด A4 สำหรับผู้บริหาร
   - ใช้ `webapp_kpi_metrics_extractor` และ `webapp_top_frequent_issues_analyzer` ดึงตัวชี้วัด KPI และสถิติปัญหาที่พบบ่อย
2. **ความปลอดภัยและการซิงก์ข้อมูลสองทาง (Two-Way Sync & Integrity Guard):**
   - ใช้ `gas_twoway_sync_guard` และ `gas_cell_targeted_cleaner` ควบคุมการซิงก์ข้อมูลระหว่างชีตแม่และชีตแยกสายงาน ป้องกันการเขียนทับโดยไม่ตั้งใจ
   - ใช้ `webapp_sla_overdue_scanner` ตรวจจับเคสที่เกินกำหนด SLA และแจ้งเตือนอัตโนมัติ
3. **การวิเคราะห์ข้อร้องเรียนด้วย NLP (Complaint NLP Mapping):**
   - ใช้ `gas_complaint_nlp_sheet_mapper` จัดหมวดหมู่ปัญหาและถอดรหัสข้อความแจ้งซ่อมเข้าสู่คอลัมน์ข้อมูลอย่างแม่นยำ

---

## 🛡️ 18. กฎการตรวจและปกป้องคุณภาพ Vibe Code (Vibe Code Quality & Security Guard)
เมื่อมีการเขียนโค้ดแบบ Vibe Coding หรือก่อนส่งมอบงานทุกครั้ง:
1. **ตรวจ 3 มิติด้วย vibe_code_guardian:** ต้องรันตรวจสอบความเรียบร้อย (Hygiene), ความถูกต้อง (Correctness), และความปลอดภัย (Security) ผ่าน `vibe_code_guardian` เสมอ
2. **เกณฑ์มาตรฐาน Vibe Health Score:** โค้ดที่พร้อมส่งมอบต้องได้คะแนน 85% ขึ้นไป (เกรด A หรือ A+) หากได้ต่ำกว่าเกรด B ต้องได้รับการปรับปรุงก่อนส่งมอบ
3. **การสะสางจุดเสี่ยงทันที:** 
   - ลบ `console.log` / `alert()` หรือคอมเมนต์ TODO/FIXME ที่หลงเหลือ
   - ครอบ `try...catch` และหลีกเลี่ยง loose equality (`==`)
   - ห้ามปล่อยให้มี Hardcoded Secrets (API Keys, Token) หรือช่องโหว่ XSS (`innerHTML`), `eval()` หลุดเข้าสู่ Production เด็ดขาด
