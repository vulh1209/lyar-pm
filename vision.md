# Lyar PM - Vision Document

## Table of Contents

- [Vision Statement](#vision-statement)
- [Problem Statement](#problem-statement)
- [Solution: Lyar PM](#solution-lyar-pm)
- [Value Proposition](#value-proposition)
- [User Journey Example](#user-journey-example)
- [Differentiators](#differentiators)
- [Long-term Vision: Open Source Ecosystem](#long-term-vision-open-source-ecosystem)
- [Competitive Analysis](#competitive-analysis)
- [User Interaction Model](#user-interaction-model)
- [Agent Architecture](#agent-architecture)
- [Risks & Challenges](#risks--challenges)
- [Open Source Strategy](#open-source-strategy)
- [Technology Foundation](#technology-foundation)
- [Onboarding Experience](#onboarding-experience)
- [Success Metrics](#success-metrics)
- [Summary](#summary)

---

## Vision Statement

**Lyar PM là Virtual Project Manager đầu tiên giúp mọi người biến ý tưởng thành phần mềm hoàn chỉnh - mà không cần biết code.**

Chúng tôi tin rằng khả năng xây dựng phần mềm không nên bị giới hạn bởi kỹ năng lập trình. Nếu bạn hiểu rõ vấn đề cần giải quyết và biết người dùng cần gì, Lyar PM sẽ lo phần còn lại.

---

## Problem Statement

### Thế giới đang có vấn đề gì?

**1. Gap giữa ý tưởng và thực thi**
- Hàng triệu người có ý tưởng sản phẩm tuyệt vời nhưng không thể hiện thực hóa
- Chi phí thuê dev team quá cao cho startups và cá nhân
- Communication gap giữa product owner và dev team gây lãng phí thời gian

**2. Các AI coding tools hiện tại chưa đủ**
- Cursor, GitHub Copilot: Yêu cầu người dùng phải biết code
- Devin: Tập trung vào coding tasks đơn lẻ, không có góc nhìn project manager
- Các tools khác: Thiếu khả năng điều phối và quản lý end-to-end

**3. Missing piece: Project Management layer**
- AI agents hiện tại làm việc độc lập, thiếu coordination
- Không có "người" đứng ra break down requirements, phân task, review, và đảm bảo chất lượng
- Người dùng phải tự làm PM - điều họ không có expertise

---

## Solution: Lyar PM

### What is Lyar PM?

Lyar PM là **Virtual Project Manager** - một AI orchestrator điều phối team các specialized AI agents để xây dựng phần mềm từ A-Z.

```
User (có ý tưởng)
       ↓
   [Lyar PM] ← Virtual Project Manager
       ↓
   ┌───┴───┐
   ↓       ↓
[Agent Dev] [Agent QA] [Agent DevOps] [Agent Design] ...
```

### Cách hoạt động

1. **Discovery Phase**
   - User mô tả ý tưởng bằng ngôn ngữ tự nhiên
   - Lyar PM hỏi các câu hỏi clarifying để hiểu rõ requirements
   - Tạo PRD (Product Requirements Document) tự động

2. **Planning Phase**
   - Break down thành epics, stories, tasks
   - Estimate complexity và suggest tech stack
   - Tạo roadmap và milestones

3. **Execution Phase**
   - Assign tasks cho các specialized agents
   - Monitor progress và handle blockers
   - Coordinate between agents (VD: FE agent cần API từ BE agent)

4. **Quality Assurance**
   - Agent QA viết và chạy tests
   - Code review tự động
   - Security scanning

5. **Delivery**
   - CI/CD setup
   - Deployment automation
   - Documentation generation

---

## Value Proposition

### Cho ai? Giải quyết gì?

| Persona | Pain Point | Lyar PM Solution |
|---------|------------|------------------|
| **Non-technical Founders** | Có ý tưởng startup nhưng không biết code, không đủ budget thuê team | Free & open source virtual dev team |
| **Solo Entrepreneurs** | Muốn build side project nhưng không có thời gian học code | Mô tả ý tưởng → nhận sản phẩm |
| **Small Business Owners** | Cần app/tool nội bộ nhưng IT resources hạn chế | Build internal tools nhanh chóng |
| **Product Managers** | Biết product nhưng phụ thuộc dev team | Prototype và MVP nhanh để validate |
| **Open Source Contributors** | Muốn đóng góp cho AI ecosystem | Contribute agents, skills, templates |

### Unique Value

> **"Bạn là Product Owner. Lyar là PM và Dev Team của bạn."**

- Không cần học code
- Không cần hire và manage dev team
- Không cần hiểu technical details
- Chỉ cần biết rõ bạn muốn gì

---

## User Journey Example

### Scenario: User muốn build "App đặt lịch cho tiệm nail"

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

Step 1: KHỞI TẠO PROJECT
────────────────────────
$ lyar init

🤖 Lyar PM: Chào bạn! Tôi là Lyar - Virtual PM của bạn.
            Hãy mô tả ý tưởng project của bạn.

👤 User: Tôi muốn làm app đặt lịch cho tiệm nail của tôi.
         Khách có thể xem dịch vụ, chọn thợ, đặt lịch online.


Step 2: DISCOVERY - PM AGENT HỎI ĐỂ HIỂU RÕ
───────────────────────────────────────────
🤖 Lyar PM: Hay lắm! Để tôi hiểu rõ hơn:

   1. Tiệm có bao nhiêu thợ nail?
   👤 User: 5 thợ

   2. Có những dịch vụ gì? (VD: sơn gel, đắp bột, chăm sóc...)
   👤 User: Sơn gel, đắp bột, vẽ nail art, chăm sóc tay chân

   3. Khách cần đăng nhập không hay đặt nhanh bằng SĐT?
   👤 User: Đặt nhanh bằng SĐT, không cần đăng ký phức tạp

   4. Cần tính năng thanh toán online không?
   👤 User: Chưa cần, khách trả tiền tại tiệm

   [Approve PRD?] ✅ Yes


Step 3: PLANNING - TẠO ROADMAP
──────────────────────────────
🤖 Lyar PM: Tôi đã tạo PRD. Đây là kế hoạch:

   📋 FEATURES (ưu tiên cao → thấp):
   ┌────────────────────────────────────────┐
   │ P0: Core Booking                       │
   │  - Xem danh sách dịch vụ + giá         │
   │  - Xem lịch trống của từng thợ         │
   │  - Đặt lịch (chọn dịch vụ + thợ + giờ) │
   │  - Xác nhận qua SMS                    │
   └────────────────────────────────────────┘
   ┌────────────────────────────────────────┐
   │ P1: Admin Dashboard                    │
   │  - Quản lý lịch hẹn                    │
   │  - Thêm/sửa dịch vụ                    │
   │  - Quản lý thông tin thợ              │
   └────────────────────────────────────────┘

   🛠 TECH STACK đề xuất:
   - Frontend: Next.js + Tailwind CSS
   - Backend: Next.js API Routes
   - Database: PostgreSQL (Supabase)
   - SMS: Twilio

   [Approve Plan?] ✅ Yes


Step 4: EXECUTION - AGENTS LÀM VIỆC
───────────────────────────────────
🤖 Lyar PM: Bắt đầu! Tôi sẽ điều phối team agents.

   [Architect Agent] 🏗️  Đang thiết kế database schema...
   → Schema có 4 tables: services, technicians, bookings, time_slots
   [Approve?] ✅ Yes

   [Backend Agent] ⚙️  Đang tạo API endpoints...
   → GET /api/services, POST /api/bookings, ...
   [Approve?] ✅ Yes

   [Frontend Agent] 🎨 Đang build UI components...
   → ServiceList, TechnicianPicker, BookingCalendar, ...
   [Approve?] ✅ Yes

   [QA Agent] 🧪 Đang viết tests...
   → 15 unit tests, 5 integration tests passed ✓

   [DevOps Agent] 🚀 Đang setup deployment...
   → Vercel deployment ready


Step 5: DELIVERY
────────────────
🤖 Lyar PM: 🎉 Project hoàn thành!

   📦 Deliverables:
   - Live URL: https://nail-booking.vercel.app
   - Admin: https://nail-booking.vercel.app/admin
   - Source code: ./nail-booking/
   - Documentation: ./nail-booking/README.md

   📊 Summary:
   - 12 API endpoints
   - 8 UI components
   - 20 tests (100% pass)
   - Mobile responsive ✓

   Bạn muốn thêm gì không?

👤 User: Thêm tính năng gửi reminder trước 1 tiếng

🤖 Lyar PM: OK! Tôi sẽ tạo task cho Backend Agent...
```

### Key Points trong Journey

| Phase | User làm gì | Lyar PM làm gì |
|-------|-------------|----------------|
| **Discovery** | Mô tả ý tưởng, trả lời câu hỏi | Hỏi clarifying questions, tạo PRD |
| **Planning** | Review & approve plan | Break down tasks, chọn tech stack |
| **Execution** | Approve từng bước quan trọng | Điều phối agents, report progress |
| **Delivery** | Nhận sản phẩm, request changes | Deploy, generate docs |

---

## Differentiators

### So với các giải pháp hiện có

| Aspect | Traditional Dev | AI Coding Tools | Lyar PM |
|--------|-----------------|-----------------|---------|
| **User Profile** | Developers | Developers | Anyone với ý tưởng |
| **Scope** | Full project | Single tasks | Full project lifecycle |
| **Coordination** | Human PM | None | AI PM orchestration |
| **Output** | Code | Code snippets | Complete product |
| **Learning curve** | Years | Months | Hours |

### Core Differentiators

**1. PM-Centric Approach**
- Không chỉ là AI viết code - mà là AI quản lý project
- Understands software development lifecycle
- Makes PM-level decisions: prioritization, resource allocation, risk management

**2. Multi-Agent Orchestration**
- Specialized agents cho từng domain (FE, BE, QA, DevOps, etc.)
- Agents communicate và collaborate với nhau
- PM agent đóng vai trò coordinator

**3. Non-Technical User First**
- UI/UX designed cho người không biết code
- Abstraction layer che đi complexity
- Progress updates bằng ngôn ngữ business, không phải technical

**4. End-to-End Project Lifecycle**
- Từ ý tưởng → requirements → design → code → test → deploy
- Không cần switch giữa nhiều tools
- Single source of truth cho project

**5. Domain Knowledge Preservation**
- User's domain knowledge được capture và sử dụng xuyên suốt
- Context không bị mất giữa các sessions
- Project history và decisions được document

---

## Long-term Vision: Open Source Ecosystem

### Phase 1: Foundation (Year 1)
- Lyar PM MVP với basic agent team
- Open source release under MIT license
- Core documentation và getting started guides
- Community Discord/GitHub Discussions

#### MVP Scope (Chi tiết)

**✅ IN SCOPE:**
| Category | Details |
|----------|---------|
| **Project Types** | Full-stack Web Apps (Next.js) |
| **Lyar Tech Stack** | Next.js (full-stack), React, Tailwind CSS, SQLite/PostgreSQL |
| **Core Agents** | PM, Architect, Frontend, Backend, QA, DevOps |
| **Deployment** | Vercel, Netlify |
| **Interface** | Web UI - user-friendly for non-technical users |
| **Architecture** | Next.js API Routes → Claude Agent SDK (single codebase) |
| **Approval** | Step-by-step (user approve từng bước) |

**❌ OUT OF SCOPE (Phase 2+):**
| Category | Reason |
|----------|--------|
| **Mobile Apps** | React Native/Flutter - cần specialized agents |
| **AI/ML Features** | Machine learning - complexity cao |
| **Blockchain/Web3** | Smart contracts - specialized domain |
| **Desktop App** | Electron version - focus web first |
| **Multi-language** | English + Vietnamese trước |

**🎯 First Milestone: Full MVP**
- User có thể tạo web app end-to-end từ ý tưởng
- Từ Web UI → mô tả idea → deployed app trên Vercel
- Với approval workflow step-by-step trong UI

### Phase 2: Community Growth (Year 2-3)
- Thêm specialized agents từ community contributions
- Plugin/extension architecture
- Multi-language support (i18n)
- Self-hosting guides và Docker images

### Phase 3: Ecosystem (Year 3-5)

**Vision: Lyar trở thành open source framework/standard cho AI-powered project management:**

1. **Agent Registry**
   - Community-contributed specialized agents
   - VD: Agent chuyên về Shopify, Agent cho healthcare
   - Open contribution model (npm-style registry)

2. **Template Library**
   - Pre-built project templates cho các use cases phổ biến
   - VD: SaaS starter, E-commerce platform, Mobile app
   - Community-maintained và reviewed

3. **Skills Library**
   - Custom skills/workflows cho các ngành nghề cụ thể
   - VD: Real estate app workflow, Restaurant management system
   - Open source contributions

4. **Integration Ecosystem**
   - Community-built integrations với popular tools
   - Standardized integration API
   - First-party và third-party integrations

### Ultimate Goal

> **Democratize software development - làm cho việc build phần mềm accessible như việc tạo slide presentation.**

Trong 5 năm, chúng tôi muốn:
- **10K+ GitHub stars** và active community
- **100,000+** non-technical users trở thành "builders"
- **50+ community-contributed agents** trong registry
- Lyar trở thành **de-facto open source framework** cho AI PM tools

---

## Competitive Analysis

### Landscape Overview

```
                    Technical Expertise Required
                    Low ←─────────────────→ High
                     │
    Full Project  ───┼──────────────────────────────
    Lifecycle        │  ★ LYAR PM
                     │     (Target Position)
                     │                    ○ Devin
                     │
                     │  ○ Lovable         ○ Cursor Composer
                     │  ○ Bolt.new
                     │                    ○ Windsurf
    Single Task   ───┼──────────────────────────────
                     │  ○ ChatGPT         ○ GitHub Copilot
                     │  ○ Claude          ○ Cursor
                     │                    ○ Codeium
```

### Direct Competitors

#### 1. Devin (Cognition AI)
| Aspect | Devin | Lyar PM |
|--------|-------|---------|
| **Positioning** | "AI Software Engineer" | "AI Project Manager + Team" |
| **Target User** | Tech companies, developers | Non-technical users |
| **Approach** | Single autonomous agent | Multi-agent orchestration |
| **Scope** | Engineering tasks | Full project lifecycle |
| **Pricing** | $500/month (closed) | Free & Open Source (MIT) |
| **Weakness** | Requires technical oversight | - |

**Our Advantage**: Devin là "developer", Lyar là "PM + dev team". Devin cần người biết code để supervise; Lyar không cần.

#### 2. Cursor / Windsurf
| Aspect | Cursor/Windsurf | Lyar PM |
|--------|-----------------|---------|
| **Positioning** | AI-powered IDE | Virtual PM platform |
| **Target User** | Professional developers | Anyone with ideas |
| **Approach** | Code completion, chat | Project orchestration |
| **Scope** | Code editing | Idea → Deployed product |
| **Learning Curve** | Need coding knowledge | No coding required |

**Our Advantage**: Họ enhance developer workflow; chúng tôi replace cần developer.

#### 3. Lovable / Bolt.new / v0
| Aspect | Lovable/Bolt | Lyar PM |
|--------|--------------|---------|
| **Positioning** | "Prompt to app" | "Idea to product" |
| **Target User** | Quick prototypers | Serious project builders |
| **Approach** | Single prompt → output | Iterative development |
| **Scope** | Simple apps, landing pages | Complex, production apps |
| **Limitations** | Limited customization | Full flexibility |
| **Backend** | Limited/none | Full-stack support |

**Our Advantage**: Họ làm demo/prototype; chúng tôi làm production software.

#### 4. Traditional Dev Agencies / Freelancers
| Aspect | Agencies/Freelancers | Lyar PM |
|--------|---------------------|---------|
| **Cost** | $10K - $500K+ | Free (chỉ trả API costs) |
| **Timeline** | Months | Days to weeks |
| **Communication** | Meetings, emails | Real-time, async |
| **Availability** | Business hours | 24/7 |
| **Scalability** | Limited by humans | Unlimited parallel work |
| **Ownership** | Vendor lock-in | Full control, self-host |

**Our Advantage**: Free & open source, 10x faster, always available, no vendor lock-in.

### Indirect Competitors

| Competitor | What They Do | Why Not a Direct Threat |
|------------|--------------|------------------------|
| **No-code (Bubble, Webflow)** | Visual builders | Limited to their templates, steep learning curve |
| **GitHub Copilot** | Code suggestions | Requires coding knowledge |
| **ChatGPT/Claude** | General AI chat | No project context, no execution |
| **Notion AI** | Document AI | No code generation |
| **Linear/Jira** | Project management | No AI execution |

### Competitive Moats

**1. Multi-Agent Architecture**
- Competitors use single-agent approach
- Our orchestration layer is unique
- Specialized agents > generalist agent

**2. PM Intelligence Layer**
- No competitor has true PM capabilities
- Requirements gathering, task breakdown, coordination
- This is our core innovation

**3. Non-Technical UX**
- Designed ground-up for non-coders
- Competitors adapt developer tools
- Different mental model entirely

**4. Context Continuity**
- Project context preserved across sessions
- Competitors start fresh each time
- Enables complex, long-term projects

**5. Vertical Integration**
- Own the full stack: PM → Dev → QA → DevOps
- Competitors are point solutions
- Better coordination, single source of truth

---

## User Interaction Model

### Interface: Web UI (User-Facing)

Lyar PM cung cấp **Web UI** thân thiện cho non-technical users. Không yêu cầu terminal/CLI knowledge.

```
┌─────────────────────────────────────────────────────────────────┐
│                         LYAR PM UI                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏠 Dashboard    📋 Projects    💬 Chat    ⚙️ Settings           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  💬 Describe your idea...                                   ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ I want to build a booking app for my nail salon     │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │                                          [Send] [Attach 📎] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  📊 Project Status: Discovery Phase                             │
│  ├── ✅ Requirements gathered                                    │
│  ├── 🔄 Creating PRD...                                          │
│  └── ⏳ Tech stack selection                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture: Next.js Full-Stack → Claude Agent SDK

```
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APPLICATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐         ┌─────────────────────────────┐   │
│   │   React UI      │◄───────►│   API Routes (/api/*)       │   │
│   │   (Pages/App)   │   SSE   │   - /api/projects           │   │
│   │                 │         │   - /api/agents             │   │
│   └─────────────────┘         │   - /api/execute            │   │
│                               └──────────────┬──────────────┘   │
│                                              │                   │
└──────────────────────────────────────────────┼───────────────────┘
                                               │
                                               ▼
                               ┌──────────────────────────┐
                               │   Claude Agent SDK       │
                               │   (spawns agents)        │
                               └──────────────────────────┘
```

**Key points:**
- **Single Next.js app** - UI + API trong cùng 1 codebase (không tách backend riêng)
- **API Routes** handle orchestration, state management, agent spawning
- **Server-Sent Events (SSE)** cho real-time progress updates
- **SQLite** cho local state (Drizzle ORM) hoặc PostgreSQL cho production
- Gọi **Claude Agent SDK** trực tiếp từ API routes
- Deploy đơn giản trên Vercel/Netlify

### Approval Workflow: Step-by-Step

User approve từng bước quan trọng để đảm bảo đúng hướng.

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPROVAL CHECKPOINTS                          │
└─────────────────────────────────────────────────────────────────┘

 ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 │   PRD    │───►│  Design  │───►│   Code   │───►│  Deploy  │
 │ Approval │    │ Approval │    │ Approval │    │ Approval │
 └──────────┘    └──────────┘    └──────────┘    └──────────┘
      ✓               ✓               ✓               ✓
   User OK?        User OK?        User OK?        User OK?
```

**Approval Points:**

| Checkpoint | User thấy gì | User quyết định |
|------------|--------------|-----------------|
| **PRD** | Requirements summary | Đúng ý tưởng chưa? |
| **Tech Stack** | Proposed stack + lý do | Đồng ý stack này? |
| **Schema/API** | Database design, API endpoints | Structure OK? |
| **UI Components** | Component list + wireframes | Design direction OK? |
| **Code Changes** | Diff của code quan trọng | Approve changes? |
| **Tests** | Test results | Ready to deploy? |
| **Deploy** | Preview URL | Go live? |

### Interaction Patterns

**1. Conversational Discovery**
```
🤖 PM: Bạn muốn users đăng nhập bằng gì?
👤 User: Email và Google
🤖 PM: OK, tôi sẽ setup NextAuth với email + Google OAuth.
        Cần thêm Facebook không?
👤 User: Không, 2 cái đó đủ rồi
```

**2. Approval Prompts**
```
🤖 PM: [Architect Agent] đề xuất database schema:

   ┌─────────────┐     ┌─────────────┐
   │    users    │────►│   orders    │
   │  - id       │     │  - id       │
   │  - email    │     │  - user_id  │
   │  - name     │     │  - total    │
   └─────────────┘     └─────────────┘

   [a] Approve  [m] Modify  [r] Reject
   > _
```

**3. Progress Updates**
```
🤖 PM: Progress update:

   ✅ PRD approved
   ✅ Schema designed
   🔄 Building API endpoints... (3/8 done)
   ⏳ Frontend components
   ⏳ Testing
   ⏳ Deployment

   Estimated: 15 minutes remaining
```

**4. Error Handling**
```
🤖 PM: ⚠️ [Backend Agent] gặp vấn đề:

   Error: Cannot connect to Supabase
   Reason: Missing SUPABASE_URL env variable

   Options:
   [1] Tôi sẽ add env variable và retry
   [2] Chuyển sang SQLite (local, không cần setup)
   [3] Dừng lại để tôi fix manually

   > _
```

---

## Agent Architecture

### Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Product Owner)                      │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LYAR PM (Orchestrator)                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ • Requirements Analysis    • Sprint Planning                ││
│  │ • Task Breakdown           • Progress Monitoring            ││
│  │ • Agent Coordination       • Conflict Resolution            ││
│  │ • Quality Gates            • User Communication             ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │  Agent   │ │  Agent   │ │  Agent   │
              │  Squad 1 │ │  Squad 2 │ │  Squad 3 │
              └──────────┘ └──────────┘ └──────────┘
```

### Core Agents

#### 1. Lyar PM Agent (Orchestrator)
**Role**: Project Manager - điều phối toàn bộ project

| Responsibility | Details |
|---------------|---------|
| **Requirements Gathering** | Interview user, extract requirements, create PRD |
| **Project Planning** | Break down into epics/stories/tasks, create roadmap |
| **Agent Assignment** | Match tasks to appropriate agents |
| **Progress Tracking** | Monitor completion, update user |
| **Quality Control** | Review agent outputs, ensure standards |
| **Conflict Resolution** | Handle blocking issues between agents |
| **Communication** | Translate technical → business language |

**Skills**:
- `requirement-analysis`: Extract structured requirements from conversation
- `task-decomposition`: Break features into implementable tasks
- `agent-routing`: Decide which agent handles which task
- `progress-report`: Generate user-friendly status updates
- `decision-making`: Make PM-level choices (prioritization, scope)

#### 2. Architect Agent
**Role**: System Designer - thiết kế kiến trúc và tech decisions

| Responsibility | Details |
|---------------|---------|
| **Tech Stack Selection** | Choose appropriate technologies |
| **System Design** | Design architecture, data models, APIs |
| **Technical Decisions** | Make build vs buy, library choices |
| **Documentation** | Create technical specs, diagrams |
| **Code Review** | Review for architecture compliance |

**Skills**:
- `tech-stack-advisor`: Recommend stack based on requirements
- `system-design`: Create architecture diagrams
- `api-design`: Design RESTful/GraphQL APIs
- `database-design`: Design schemas, relationships
- `scalability-planning`: Plan for growth

#### 3. Frontend Agent
**Role**: UI Developer - xây dựng user interface

| Responsibility | Details |
|---------------|---------|
| **UI Development** | Build React/Vue/Next.js components |
| **Styling** | Implement designs with CSS/Tailwind |
| **State Management** | Handle frontend state |
| **API Integration** | Connect to backend APIs |
| **Responsive Design** | Ensure mobile compatibility |

**Skills**:
- `react-development`: Build React components
- `nextjs-development`: Next.js pages, routing, SSR
- `tailwind-styling`: Implement Tailwind CSS
- `state-management`: Redux, Zustand, Context
- `api-integration`: Fetch, axios, React Query

#### 4. Backend Agent
**Role**: API Developer - xây dựng backend logic

| Responsibility | Details |
|---------------|---------|
| **API Development** | Build REST/GraphQL endpoints |
| **Business Logic** | Implement core functionality |
| **Database Operations** | CRUD, queries, migrations |
| **Authentication** | Auth flows, session management |
| **Third-party Integration** | Connect external services |

**Skills**:
- `nodejs-development`: Express, Fastify, NestJS
- `python-development`: FastAPI, Django, Flask
- `database-operations`: SQL, ORM, migrations
- `authentication`: JWT, OAuth, session management
- `api-integration`: External API connections

#### 5. QA Agent
**Role**: Quality Engineer - đảm bảo chất lượng

| Responsibility | Details |
|---------------|---------|
| **Test Writing** | Unit, integration, e2e tests |
| **Test Execution** | Run test suites |
| **Bug Detection** | Find issues before deploy |
| **Test Coverage** | Ensure adequate coverage |
| **Regression Testing** | Verify fixes don't break things |

**Skills**:
- `unit-testing`: Jest, Vitest, pytest
- `integration-testing`: API testing, DB testing
- `e2e-testing`: Playwright, Cypress
- `test-coverage`: Coverage analysis, gap identification
- `bug-reporting`: Clear, actionable bug reports

#### 6. DevOps Agent
**Role**: Infrastructure Engineer - deployment và operations

| Responsibility | Details |
|---------------|---------|
| **CI/CD Setup** | GitHub Actions, automated pipelines |
| **Deployment** | Deploy to Vercel, AWS, GCP |
| **Infrastructure** | Set up servers, databases, CDN |
| **Monitoring** | Set up logging, alerts |
| **Security** | SSL, environment management |

**Skills**:
- `cicd-setup`: GitHub Actions, GitLab CI
- `vercel-deployment`: Deploy Next.js apps
- `aws-deployment`: EC2, Lambda, S3, RDS
- `docker`: Containerization
- `monitoring`: Logging, alerting, APM

#### 7. Security Agent
**Role**: Security Engineer - bảo mật

| Responsibility | Details |
|---------------|---------|
| **Security Review** | Audit code for vulnerabilities |
| **OWASP Compliance** | Check against top 10 |
| **Secret Management** | Ensure no leaked credentials |
| **Penetration Testing** | Basic security testing |
| **Compliance** | GDPR, data protection |

**Skills**:
- `security-audit`: Code vulnerability scanning
- `owasp-check`: OWASP top 10 compliance
- `secret-scanning`: Detect leaked secrets
- `security-headers`: Configure security headers
- `data-protection`: GDPR compliance checks

#### 8. Documentation Agent
**Role**: Technical Writer - tài liệu

| Responsibility | Details |
|---------------|---------|
| **API Documentation** | OpenAPI/Swagger specs |
| **User Guides** | How-to documentation |
| **Code Comments** | Inline documentation |
| **README** | Project setup instructions |
| **Changelog** | Version history |

**Skills**:
- `api-docs`: Generate OpenAPI specs
- `user-guides`: Write user documentation
- `readme-generation`: Create comprehensive READMEs
- `changelog`: Maintain version history
- `diagram-generation`: Create flow diagrams

### Specialized Agents (Phase 2+)

| Agent | Specialty | Use Cases |
|-------|-----------|-----------|
| **AI/ML Agent** | Machine learning | Recommendation systems, NLP features |
| **Mobile Agent** | React Native, Flutter | Mobile app development |
| **Blockchain Agent** | Web3, Smart contracts | DeFi, NFT platforms |
| **Data Agent** | Analytics, BI | Dashboards, reporting |
| **Design Agent** | UI/UX | Figma integration, design systems |
| **Content Agent** | Copywriting | Marketing, UI copy |
| **SEO Agent** | Search optimization | Meta tags, sitemap, performance |
| **Payment Agent** | Stripe, payments | E-commerce, subscriptions |

### Agent Communication Protocol

```
┌──────────────┐         ┌──────────────┐
│   Agent A    │◄───────►│   Lyar PM    │◄───────►│   Agent B    │
└──────────────┘         └──────────────┘         └──────────────┘
        │                       │                        │
        │    Task Assignment    │                        │
        │◄──────────────────────│                        │
        │                       │                        │
        │    Status Update      │                        │
        │──────────────────────►│                        │
        │                       │                        │
        │                       │   Dependency Request   │
        │                       │◄───────────────────────│
        │                       │                        │
        │   Provide API Spec    │                        │
        │◄──────────────────────│                        │
        │                       │                        │
        │   Handoff Complete    │                        │
        │──────────────────────►│──────────────────────►│
```

**Message Types**:
- `TASK_ASSIGN`: PM assigns task to agent
- `STATUS_UPDATE`: Agent reports progress
- `DEPENDENCY_REQUEST`: Agent needs output from another
- `HANDOFF`: Agent completes and passes to next
- `BLOCKER`: Agent reports blocking issue
- `REVIEW_REQUEST`: Agent requests PM review
- `APPROVAL`: PM approves agent work

### Agent Spawning Strategy

| Project Type | Initial Agents | Scale Up When |
|--------------|----------------|---------------|
| **Landing Page** | PM, FE, DevOps | Forms → add BE |
| **Web App** | PM, Architect, FE, BE, DevOps | Complex → add QA, Security |
| **Mobile App** | PM, Architect, Mobile, BE, DevOps | E-commerce → add Payment |
| **SaaS** | PM, Architect, FE, BE, QA, DevOps, Security | AI features → add AI/ML |
| **E-commerce** | PM, Architect, FE, BE, Payment, DevOps, Security | Scale → add Data |

---

## Risks & Challenges

### Identified Risks

#### 1. User Expectations (HIGH RISK)
**Problem**: Non-technical users có thể expect "magic" - nói gì cũng ra app hoàn hảo.

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Expect perfect output lần đầu | User frustrated, churn | Set expectations rõ: iterative process |
| Không hiểu limitations | Blame tool khi fail | Onboarding explains what Lyar can/cannot do |
| Expect instant results | Impatient với process | Show progress, explain why each step matters |

**Mitigation Strategies:**
- Clear onboarding: "Lyar là PM, không phải magic wand"
- Realistic examples trong docs
- Progress transparency: show what's happening
- Graceful failures với clear explanations

#### 2. Quality Output (HIGH RISK)
**Problem**: AI-generated code có thể chưa production-ready.

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Bugs trong generated code | User projects fail | QA Agent + mandatory testing |
| Security vulnerabilities | Data breaches | Security Agent review |
| Poor code structure | Hard to maintain | Architect review + best practices |
| Edge cases not handled | Runtime errors | Comprehensive test coverage |

**Mitigation Strategies:**
- Multi-layer review (Architect → Dev → QA → Security)
- Mandatory test coverage before deploy
- Security scanning built-in
- Human-in-the-loop approval at each step
- Clear "beta" labeling for MVP

#### 3. Context Limits (MEDIUM RISK)
**Problem**: Large projects có thể exceed context window của LLM.

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Project quá lớn | Agents forget context | Chunking + summarization |
| Long conversations | Miss early requirements | Persistent state in SQLite |
| Many files | Can't see full picture | Smart file selection |

**Mitigation Strategies:**
- SQLite persistent state (không rely on context alone)
- Smart context management (summarize old, keep recent)
- File-based artifacts (PRD, specs lưu file, không chỉ in-memory)
- Project scoping: guide users to smaller, focused projects

#### 4. Agent Coordination (MEDIUM RISK)
**Problem**: Multiple agents có thể conflict hoặc handoff không smooth.

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Agents contradict nhau | Confusion, wasted work | PM as single source of truth |
| Poor handoffs | Missing context | Structured handoff protocol |
| Blocking dependencies | Slow progress | Dependency graph + parallel work |

**Mitigation Strategies:**
- PM Agent là single coordinator
- Structured message protocol (TASK_ASSIGN, HANDOFF, etc.)
- Explicit dependency management
- Clear ownership per task

### Risk Matrix

```
           LOW IMPACT ──────────────────► HIGH IMPACT
           │
HIGH       │  Context     │  User Expectations
LIKELIHOOD │  Limits      │  Quality Output
           │              │
           ├──────────────┼──────────────────
           │              │
LOW        │  Agent       │  Security
LIKELIHOOD │  Coord       │  Breaches
           │              │
```

### Not Risks (Addressed by Design)

| Potential Risk | Why Not a Risk |
|----------------|----------------|
| **Vendor lock-in** | Open source + self-host |
| **Data privacy** | Local-first, BYOK |
| **Cost scaling** | User pays own API costs |
| **Single point of failure** | Claude Code Agent SDK handles reliability |

---

## Open Source Strategy

### License: MIT

Lyar PM là dự án **open source** dưới giấy phép MIT.

```
MIT License

Copyright (c) 2026 Lyar PM

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

### Tại sao Open Source?

**1. Democratize Software Development - Thực sự**
- Không chỉ là slogan - ai cũng có thể dùng, không phải trả tiền
- Phù hợp với vision: "mọi người có thể build phần mềm"
- Loại bỏ rào cản tài chính

**2. Community-Driven Innovation**
- Contributors từ khắp nơi cải thiện agents
- Specialized agents được community phát triển
- Faster iteration qua collective intelligence

**3. Trust & Transparency**
- Người dùng thấy code hoạt động thế nào
- Không lo về data privacy - có thể self-host
- Security vulnerabilities được phát hiện nhanh hơn

**4. Adoption & Ecosystem**
- Dễ dàng thử nghiệm và adopt
- Integrations được community build
- Trở thành standard/framework cho AI PM tools

### Contribution Model

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTRIBUTION AREAS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Core Agents  │  │ Specialized  │  │ Integrations │          │
│  │              │  │   Agents     │  │              │          │
│  │ PM, FE, BE   │  │ AI/ML, Web3  │  │ Stripe, AWS  │          │
│  │ QA, DevOps   │  │ Mobile, etc  │  │ Firebase...  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Skills     │  │  Templates   │  │Documentation │          │
│  │              │  │              │  │              │          │
│  │ Agent skills │  │ Project      │  │ Guides, API  │          │
│  │ & prompts    │  │ starters     │  │ docs, i18n   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Self-Hosting

Users có thể:
- **Self-host** toàn bộ Lyar PM trên infrastructure của họ
- **Bring Your Own API Key** - dùng Claude/OpenAI key riêng
- **Customize** agents cho use case cụ thể
- **Private deployment** cho enterprise/compliance needs

### Community Goals

| Milestone | Target |
|-----------|--------|
| GitHub Stars | 10K+ trong năm đầu |
| Contributors | 100+ active contributors |
| Agents | 50+ community agents |
| Templates | 100+ project templates |
| Languages | 10+ languages support |

### Sustainability Model (Optional Future)

Nếu cần sustain development, có thể xem xét:

| Model | Description |
|-------|-------------|
| **Sponsors** | GitHub Sponsors, Open Collective |
| **Hosted Version** | Managed cloud service (optional) |
| **Enterprise Support** | Paid support & consulting |
| **Bounties** | Sponsored features from companies |

> **Note**: Business model là optional và sẽ được quyết định sau dựa trên community feedback.

---

## Technology Foundation

### Core Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| **Language** | TypeScript | Type safety, ecosystem, developer familiarity |
| **Runtime** | Node.js / Bun | Fast, async, good for CLI |
| **AI Backend** | Claude Code Agent SDK | Subscription-based, handles orchestration |
| **State Storage** | SQLite | Local-first, portable, no setup required |
| **CLI Framework** | Commander.js + Ink | Rich terminal UI |
| **Package Manager** | npm/pnpm | Standard, wide adoption |

### Built on Claude Code Agent SDK

```
┌─────────────────────────────────────────────────────────────────┐
│                    LYAR PM ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    CLI Interface                          │   │
│  │              (TypeScript + Commander + Ink)               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Orchestration Layer                      │   │
│  │                     (PM Agent)                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐        │
│  │ Specialized│      │ Specialized│      │ Specialized│        │
│  │   Agents   │      │   Agents   │      │   Agents   │        │
│  └────────────┘      └────────────┘      └────────────┘        │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Claude Code Agent SDK                        │   │
│  │           (Subscription Plan - handles LLM)               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

```
Project State (SQLite)
├── projects/
│   ├── project_id
│   ├── name
│   ├── status
│   └── created_at
├── conversations/
│   ├── conversation_id
│   ├── project_id
│   ├── messages (JSON)
│   └── summary
├── artifacts/
│   ├── artifact_id
│   ├── project_id
│   ├── type (PRD, schema, code, etc.)
│   ├── content
│   └── version
├── tasks/
│   ├── task_id
│   ├── project_id
│   ├── agent
│   ├── status
│   └── output
└── approvals/
    ├── approval_id
    ├── task_id
    ├── checkpoint
    ├── status
    └── user_feedback
```

### Agent Implementation

Mỗi agent là một Claude Code skill với specialized prompts:

```typescript
// Ví dụ: Frontend Agent
const frontendAgent = {
  name: 'frontend-agent',
  description: 'Builds React/Next.js UI components',

  skills: [
    'react-development',
    'nextjs-development',
    'tailwind-styling',
    'api-integration'
  ],

  systemPrompt: `You are a Frontend Developer agent.
    Your responsibilities:
    - Build React components following best practices
    - Use Tailwind CSS for styling
    - Ensure responsive design
    - Connect to backend APIs

    Output format: Always provide complete, runnable code.
    Never use placeholders or TODOs.`
};
```

### Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Agent Specialization** | Each agent masters one domain, has specific skills |
| **PM as Orchestrator** | Single source of truth, coordinates all agents |
| **Local-First** | SQLite state, files in project folder |
| **Context Preservation** | State persisted, summaries for long conversations |
| **Iterative Development** | Build → Review → Approve → Improve loop |
| **Human-in-the-Loop** | User approves at each checkpoint |

---

## Onboarding Experience

### Getting Started Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONBOARDING FLOW (Web UI)                      │
└─────────────────────────────────────────────────────────────────┘

Step 1: ACCESS
──────────────
Open browser → https://lyar.pm (hoặc self-hosted instance)


Step 2: SIGN UP / CONNECT
─────────────────────────
┌─────────────────────────────────────────────────┐
│  🤖 Welcome to Lyar PM!                         │
│                                                 │
│  Connect your Claude Code subscription:         │
│  [Connect with Claude Code] ← OAuth flow        │
│                                                 │
│  Or enter API key manually:                     │
│  [____________________________] [Connect]       │
└─────────────────────────────────────────────────┘


Step 3: FIRST PROJECT
─────────────────────
┌─────────────────────────────────────────────────┐
│  🎉 Let's build something!                      │
│                                                 │
│  Describe your idea:                            │
│  ┌─────────────────────────────────────────┐   │
│  │ I want to build a booking app for my    │   │
│  │ nail salon...                            │   │
│  └─────────────────────────────────────────┘   │
│                                   [Start] 🚀    │
│                                                 │
│  ─────────────────────────────────────────────  │
│  WHAT LYAR CAN DO:                              │
│  ✓ Full-stack web apps (Next.js)               │
│  ✓ Landing pages                                │
│  ✓ Admin dashboards                            │
│  ✓ CRUD applications                           │
│  ✓ E-commerce (basic)                          │
│                                                 │
│  WHAT LYAR CANNOT DO (YET):                    │
│  ✗ Mobile apps                                 │
   │  ✗ AI/ML features                              │
   │  ✗ Blockchain/Web3                             │
   │  ✗ Complex enterprise systems                  │
   └─────────────────────────────────────────────────┘

   Now, describe your idea...

👤 User: [types idea]
```

### First-Time User Experience

| Step | What Happens | User Feels |
|------|--------------|------------|
| **Install** | One command, < 1 min | "Easy, like any npm package" |
| **Setup** | Connect SDK, set defaults | "Clear instructions" |
| **Expectations** | Show can/cannot do | "I know what to expect" |
| **First Prompt** | PM asks clarifying questions | "It understands me" |
| **First Output** | PRD generated | "Wow, it captured my idea!" |
| **First Approval** | User approves PRD | "I'm in control" |

### Onboarding Principles

**1. Start from Blank Project**
- No templates upfront (simplicity)
- User describes idea in their own words
- PM Agent guides the discovery

**2. Set Expectations Early**
- Clear "can do / cannot do" list
- "Lyar is a PM, not magic" messaging
- Iterative process explanation

**3. Quick Time-to-Value**
- First PRD within 5 minutes
- First code output within 15 minutes
- Deployed preview within 1 hour

**4. Human-in-the-Loop from Start**
- First approval happens early (PRD)
- User learns the approval flow quickly
- Builds trust through transparency

---

## Success Metrics

### North Star Metric
**Projects successfully deployed** - số projects hoàn thành và deploy được

### Funnel Metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER FUNNEL                                   │
└─────────────────────────────────────────────────────────────────┘

Install ──► Setup ──► First Project ──► PRD Approved ──► Deployed
  100%       80%         60%              40%             25%

Target conversion rates (MVP)
```

| Stage | Metric | Target |
|-------|--------|--------|
| **Install → Setup** | Setup completion rate | > 80% |
| **Setup → First Project** | Project initiation rate | > 60% |
| **First Project → PRD** | PRD approval rate | > 70% |
| **PRD → Code** | Code generation success | > 80% |
| **Code → Deploy** | Deployment success rate | > 60% |

### Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to PRD** | < 5 min | From `lyar init` to PRD approval |
| **Time to First Code** | < 15 min | From PRD to first code output |
| **Time to Deploy** | < 1 hour | From start to live URL |
| **Test Pass Rate** | > 90% | Generated code passes tests |
| **User Satisfaction** | > 4/5 | Post-project survey |

### Community Metrics (Open Source)

| Metric | Target (Year 1) |
|--------|-----------------|
| **GitHub Stars** | 10K+ |
| **Contributors** | 100+ |
| **Discord Members** | 5K+ |
| **Projects Created** | 10K+ |
| **Community Agents** | 20+ |

### Success Definition

**MVP Success = User can go from idea → deployed web app in < 1 hour**

Measured by:
- Average time from `lyar init` to `vercel.app` URL
- Percentage of projects that reach deployment
- User satisfaction score post-deployment

---

## Summary

**Lyar PM** không phải là thêm một AI coding tool. Đây là paradigm shift trong cách phần mềm được tạo ra:

- **From**: Cần biết code để build
- **To**: Cần hiểu problem để build

Chúng tôi đang xây dựng tương lai nơi **ý tưởng là đủ** - và AI team của Lyar sẽ lo phần execution.

---

*Version: 2.0*
*Last Updated: 2026-01-04*
