/* AI Trends — AI Agent 百科数据
   fresh 字段 = 结合最新行业动态的补充，点击「更新百科」按钮查看刷新方法 */
window.AIT_WIKI = {
  updated: "2026-06-15",
  cats: [
    { id: "basics", label: "基础概念" },
    { id: "tech",   label: "核心技术" },
    { id: "eco",    label: "协议与生态" },
    { id: "bench",  label: "评测与行话" }
  ],
  terms: [
    {
      id: "LONG-TERM-MEMORY", cat: "tech", zh: "长期记忆", en: "LONG-TERM MEMORY",
      brief: "AI Agent 存储历史交互和经验知识，供后续检索使用的持久化知识库。",
      body: "长期记忆是 AI Agent 用来存储和检索历史交互和经验知识的关键技术组件。它允许 Agent 在新的会话中访问之前沉淀的偏好、事实和历史决策，从而提供个性化服务，并在长时间跨度上保持行为的一致性和经验积累。长期记忆通常通过向量数据库、知识图谱或传统数据库实现，支持信息的持久化存储和语义检索。",
      pm: "在产品设计中，长期记忆机制的引入使得 AI Agent 能够记住用户的偏好和历史交互，提供更加连贯和个性化的用户体验。",
      fresh: "最新动态显示，长期记忆在 AI Agent 架构中扮演着越来越重要的角色，特别是在提供个性化服务和跨会话一致性方面。例如，澜码科技等公司正在探索如何通过长期记忆机制让 AI Agent 在销售管理等场景中提供更精准的建议和指导。"
    },
    {
      id: "SHORT-TERM-MEMORY", cat: "tech", zh: "短期记忆", en: "SHORT-TERM MEMORY",
      brief: "AI Agent 存储当前会话交互信息的临时记忆系统。",
      body: "短期记忆是 AI Agent 用来存储当前会话中产生的各类消息，包括用户输入、模型回复、工具调用及其结果等。这些消息直接参与模型推理，实时更新，并受模型的 maxToken 限制。短期记忆通常使用循环神经网络、注意力机制等技术实现，以保持对话的连贯性和上下文感知能力。",
      pm: "在产品应用中，短期记忆确保 AI Agent 在同一会话中能够理解和响应用户的连续指令，提供流畅的交互体验。",
      fresh: "随着技术的发展，短期记忆的管理和优化成为提升 AI Agent 性能的关键。例如，通过上下文工程策略如压缩、卸载、摘要等，可以有效管理短期记忆中的信息，防止信息过载并保持会话的连贯性。"
    },
    {
      id: "agent", cat: "basics", zh: "AI Agent / 智能体", en: "AI AGENT",
      brief: "能感知环境、自主规划、调用工具并完成多步任务的 AI 系统。",
      body: "与聊天机器人的本质区别在于「闭环」：聊天机器人输出文字让人去执行，Agent 自己执行并根据结果调整下一步。判断标准三件套——能否调用工具、能否多步规划、能否根据反馈自我修正。",
      pm: "评估一个「Agent 产品」先问一句：无人盯着时，它能不能独立完成 10 步以上的任务？不能的话，它只是个带按钮的聊天框。",
      fresh: "2026 年行业焦点已从「能不能做 Agent」转向「Agent 连续跑多久不翻车」，长程稳定性成为新的竞争轴。"
    },
    {
      id: "llm", cat: "basics", zh: "大语言模型", en: "LLM",
      brief: "通过海量文本训练出的「预测下一个词」的模型，是所有 Agent 的大脑。",
      body: "GPT、Claude、Gemini、Qwen、DeepSeek 都是 LLM。Agent = LLM（大脑）+ 工具（手脚）+ 记忆（笔记本）+ 循环（执行力）。模型决定上限，工程决定下限。",
      pm: "选型时少看营销跑分，多看你场景里的实测：同一个任务跑 20 遍，数成功率和成本。",
      fresh: "当前旗舰：GPT-5.5、Claude Fable 5 / Opus 4.8、Gemini 3.1 Pro；国产：Qwen 3.7 Max、DeepSeek V4、Kimi K2.6、GLM-5.1、MiniMax M3。"
    },
    {
      id: "context", cat: "basics", zh: "Token 与上下文窗口", en: "CONTEXT WINDOW",
      brief: "Token 是模型处理文本的最小单位；上下文窗口是模型一次能「记住」的总量。",
      body: "1 个汉字约 1~2 个 token。上下文窗口就是模型的工作记忆：放不下的内容它就「忘了」。API 按 token 计费，输入输出价格不同。",
      pm: "上下文不是越大越好——塞得越满，模型对中间内容的注意力越差（lost in the middle），成本也线性上涨。",
      fresh: "2026 年旗舰标配已达 1M token（Opus 4.8、GPT-5.5 的 922K、Qwen 3.7 Plus），「整个项目塞进上下文」成为可能。"
    },
    {
      id: "reasoning", cat: "basics", zh: "推理模型", en: "REASONING MODEL",
      brief: "回答前先进行长链「思考」的模型，用更多计算时间换更高准确率。",
      body: "由 OpenAI o1（2024.9）与 DeepSeek-R1（2025.1）带火。适合数学、代码、复杂规划；不适合闲聊和低延迟场景——又慢又贵。",
      pm: "产品里要分流：简单请求走快模型，硬任务走推理模型。一刀切用最贵的，是新手 PM 最常见的成本事故。",
      fresh: "2026 年推理能力已并入旗舰模型（可调「思考力度」），单独的推理模型 SKU 正在消失。"
    },
    {
      id: "multimodal", cat: "basics", zh: "多模态", en: "MULTIMODAL",
      brief: "能同时理解/生成文本、图像、音频、视频的模型能力。",
      body: "对 Agent 的意义不是「能看图」这么简单：看懂屏幕截图是 Computer Use 的前提，看懂图纸、报表、照片是 Agent 进入实体行业的门票。",
      pm: "多模态演示效果最炫，但落地要盯准确率：OCR 表格、读仪表盘这类任务，差 5 个点的准确率就是「能用」和「不能用」的区别。",
      fresh: "Google 于 6.10 开源 DiffusionGemma 26B，图像生成的开源选项进一步丰富。"
    },
    {
      id: "openweights", cat: "basics", zh: "开源权重", en: "OPEN WEIGHTS",
      brief: "公开模型参数文件，任何人可下载、自部署、微调的发布方式。",
      body: "严格说多数是「开放权重」而非完整开源（训练数据和代码不公开）。代表：Llama、Qwen、DeepSeek、GLM、Kimi。价值：数据不出域、成本可控、不被供应商锁定。",
      pm: "「用开源还是闭源」是伪问题，真问题是混合编排：敏感数据走本地开源模型，硬任务走旗舰 API。",
      fresh: "DeepSeek V4 Pro（MIT 协议）已贴近闭源旗舰性能、价格低 30 倍+；中国队是开源权重的绝对主力。"
    },
    {
      id: "tooluse", cat: "tech", zh: "工具调用", en: "TOOL USE / FUNCTION CALLING",
      brief: "让模型按约定格式「点菜」调用外部函数/API，是 Agent 的手和脚。",
      body: "2023.6 OpenAI 引入 Function Calling，是 Agent 时代的起点技术。模型不直接执行，而是输出结构化调用请求，由你的代码执行后把结果喂回去。",
      pm: "工具设计是 Agent 产品的核心工作：工具太多模型会选错，描述模糊模型会乱传参。好的工具集像好的菜单——少而清晰。",
      fresh: "工具调用的标准化已被 MCP 协议接管，自定义 function schema 的时代正在过去。"
    },
    {
      id: "rag", cat: "tech", zh: "检索增强生成", en: "RAG",
      brief: "先从知识库检索相关内容塞给模型，再让它回答——给模型开卷考试。",
      body: "解决两个问题：模型不知道你的私有数据、模型知识有截止日期。典型链路：文档切片 → 向量化 → 相似检索 → 拼进提示词。代表项目：RAGFlow、LlamaIndex。",
      pm: "RAG 项目 80% 的工夫在数据清洗和切片策略，不在模型。Demo 一天，调优三个月。",
      fresh: "1M 上下文挤压了 RAG 的简单场景（直接塞文档更省事），但权限控制、超大知识库、实时数据场景仍是 RAG 的主场。"
    },
    {
      id: "memory", cat: "tech", zh: "Agent 记忆", en: "MEMORY",
      brief: "让 Agent 跨会话记住用户和经验的机制，分短期（上下文）与长期（外部存储）。",
      body: "长期记忆的主流做法：把关键信息抽取出来存到向量库或文件，下次对话时检索回来。代表项目：mem0（58K 星）、claude-mem。难点是「记什么、忘什么」的策略。",
      pm: "记忆是个人 Agent 的留存抓手——用得越久越懂你，迁移成本越高。设计时记得给用户「看到并删除记忆」的入口，这是信任问题也是合规问题。",
      fresh: "OpenClaw 的爆红验证了「有记忆的常驻助理」这一形态，2026 年记忆层已成 Agent 标配组件。"
    },
    {
      id: "planning", cat: "tech", zh: "规划与 ReAct", en: "PLANNING / REACT",
      brief: "Agent 把大目标拆成小步骤并边做边调整的能力；ReAct = 思考→行动→观察 循环。",
      body: "ReAct（Reason + Act）是最经典的 Agent 执行模式：每一步先推理该做什么，执行一个动作，观察结果，再决定下一步。几乎所有 Agent 框架的底层都是它的变体。",
      pm: "规划能力决定 Agent 的任务上限，但步骤越多错误越会累积——10 步任务每步 95% 成功率，整体只剩 60%。这就是为什么「人类审核关键节点」仍是主流设计。",
      fresh: "Kimi K2.6 宣称单次自主运行可执行 4000 个协调动作，长程规划是 2026 国产模型主打卖点。"
    },
    {
      id: "multiagent", cat: "tech", zh: "多智能体系统", en: "MULTI-AGENT",
      brief: "多个各有分工的 Agent 协作完成任务，像一个虚拟团队。",
      body: "MetaGPT 让「产品经理、架构师、工程师」Agent 协作写软件；CrewAI、AutoGen 提供通用编排。优势是分工明确、并行处理；代价是通信成本和错误传播。",
      pm: "别为了多而多：单 Agent 能解决的，多 Agent 只会更贵更难调。多 Agent 的真正价值在「不同权限/不同模型」的隔离场景。",
      fresh: "Kimi K2.6 的 Agent Swarm 可调度 300 个子代理；Claude Code 等编程工具也已内置子代理机制——多智能体正从论文走进产品。"
    },
    {
      id: "computeruse", cat: "tech", zh: "计算机操作", en: "COMPUTER USE",
      brief: "让 AI 像人一样看屏幕、动鼠标、敲键盘，操作任何软件。",
      body: "Anthropic 2024.10 首发。两条路线：视觉路线（看截图点坐标，通用但慢）和 DOM 路线（读网页结构，快但限于浏览器，代表 browser-use，98K 星）。",
      pm: "适用判断：有 API 优先走 API，没 API 的存量系统（ERP、政务网站、老软件）才是 Computer Use 的主场——这恰恰是企业自动化最值钱的部分。",
      fresh: "2026 年准确率仍是瓶颈，生产环境主流方案是「Computer Use + 人工兜底」混合模式。"
    },
    {
      id: "workflow", cat: "tech", zh: "Agentic 工作流", en: "AGENTIC WORKFLOW",
      brief: "把 AI 能力嵌进预定义流程：路径固定的用工作流，路径开放的才用自主 Agent。",
      body: "一条光谱：左端是 n8n / Dify 式工作流（每步可控、可预测），右端是 OpenClaw 式自主 Agent（给目标自己跑）。生产环境的大多数「Agent」其实是左端的工作流。",
      pm: "客户要的是确定性。能用工作流交付的就别上自主 Agent——可控性是企业买单的前提，「全自主」目前更多是融资叙事。",
      fresh: "Langflow（150K 星）、Dify（145K 星）、n8n（192K 星）的星数说明：可视化工作流是当前最大众的 Agent 落地形态。"
    },
    {
      id: "contexteng", cat: "tech", zh: "上下文工程", en: "CONTEXT ENGINEERING",
      brief: "提示词工程的进化版：系统性管理喂给模型的全部信息——指令、工具、记忆、检索结果。",
      body: "2025 年起取代 Prompt Engineering 成为主流话语。核心问题从「怎么写一句好提示词」变成「在有限上下文里，放什么、按什么顺序放、什么时候丢弃」。",
      pm: "这是 AI 产品质量的隐形决定因素：同一个模型，上下文组织得好坏能差出 30% 的任务成功率。团队里要有人专门管这件事。",
      fresh: "各家 Agent 工具的「压缩/摘要/记忆分层」机制（如 Claude Code 的 auto-compact）都是上下文工程的产品化。"
    },
    {
      id: "mcp", cat: "eco", zh: "模型上下文协议", en: "MCP",
      brief: "连接 AI 与外部工具/数据的开放标准，被称为「AI 的 USB-C」。",
      body: "Anthropic 2024.11 开源。以前每个应用要为每个工具写一套对接，MCP 把它标准化成「一次实现、处处可用」。2025 年被 OpenAI、Google 相继采纳，成为事实标准。",
      pm: "MCP 之于 Agent，相当于 App Store 之于 iPhone——生态位远大于技术本身。做 AI 产品先问：我的服务有 MCP server 了吗？",
      fresh: "官方 servers 仓库已达 87K 星；微软 Scout、OpenClaw 等新产品原生内置 MCP 支持。"
    },
    {
      id: "a2a", cat: "eco", zh: "Agent 间协议", en: "A2A",
      brief: "Google 2025.4 发起的 Agent 互相通信的标准协议。",
      body: "MCP 解决「Agent 连工具」，A2A 解决「Agent 连 Agent」：你的差旅 Agent 直接和航司的订票 Agent 对话成交。50+ 企业首发支持，后捐给 Linux 基金会。",
      pm: "如果 A2A 跑通，「Agent 经济」会重塑 B2B 接口层——你的产品可能需要一个「Agent 门面」来接待别人的 Agent 客户。目前仍处早期，关注但不必押注。",
      fresh: "2026 年 A2A 落地仍以大厂生态内为主，跨厂商的 Agent 交易还在试点阶段。"
    },
    {
      id: "framework", cat: "eco", zh: "Agent 框架", en: "AGENT FRAMEWORK",
      brief: "搭建 Agent 的代码脚手架，封装好工具调用、记忆、规划等通用件。",
      body: "类比前端的 React/Vue。主流选手：LangChain/LangGraph（生态最大）、AutoGen（微软）、CrewAI（多角色协作）、OpenAI Agents SDK、Google ADK、smolagents（极简）、pydantic-ai（类型安全）。",
      pm: "框架选型看三点：团队语言栈、社区活跃度、和你模型供应商的兼容性。警惕过度封装——很多团队最后都回归「裸调 API + 自建薄框架」。",
      fresh: "2026 年趋势是「框架瘦身」：模型自身能力变强后，重框架的价值在下降，编排层在向 MCP 和模型原生能力转移。"
    },
    {
      id: "sandbox", cat: "eco", zh: "沙箱", en: "SANDBOX",
      brief: "Agent 执行代码和命令的安全隔离环境，防止它误伤真实系统。",
      body: "Agent 会写代码、跑命令、改文件——必须关进沙箱。代表项目：Daytona（72K 星）、E2B。隔离级别从 Docker 容器到微虚拟机不等。",
      pm: "企业客户的第一个安全问题一定是「它会不会删我的库」。沙箱 + 权限分级 + 操作审计，是 Agent 产品过安全评审的三件套。",
      fresh: "2026 年「Agent 基建」成为独立赛道，沙箱即服务（Sandbox-as-a-Service）公司密集获投。"
    },
    {
      id: "skills", cat: "eco", zh: "技能包", en: "SKILLS",
      brief: "给 Agent 的可复用能力包：一份说明文档 + 可选脚本，即插即用。",
      body: "由 Claude Skills 带火的轻量扩展方式：不用写代码对接，把「怎么做这类任务」写成结构化文档，Agent 需要时自己加载。与 MCP 互补——MCP 给工具，Skills 给方法。",
      pm: "Skills 的本质是「把组织的隐性知识显性化」。企业落地 Agent 时，沉淀 Skills 库 = 沉淀数字资产，这是比买模型更长期的投入。",
      fresh: "GitHub 上 awesome-claude-skills 已 64K 星，Skills 市场正在形成。"
    },
    {
      id: "swebench", cat: "bench", zh: "SWE-bench", en: "SWE-BENCH",
      brief: "用真实 GitHub issue 考察 AI 修代码能力的基准，编程 Agent 的「高考」。",
      body: "从开源项目抽取真 bug，让 Agent 读库、改代码、跑测试。衍生出更难的 SWE-Pro、考终端操作的 Terminal-Bench。比「写个贪吃蛇」式演示可信得多。",
      pm: "看分数要看三件事：哪个版本（Verified/Pro 难度差很多）、花了多少钱跑出来的、是否多次采样取最优。营销稿通常只给第一个数。",
      fresh: "当前水位：Qwen 3.7 Max SWE-Pro 60.6%；旗舰模型在 SWE-bench Verified 上已普遍超过 70%。"
    },
    {
      id: "hallucination", cat: "bench", zh: "幻觉", en: "HALLUCINATION",
      brief: "模型一本正经地编造事实。在 Agent 场景里，幻觉会变成错误的「行动」。",
      body: "聊天里的幻觉是答错话，Agent 里的幻觉是订错机票、删错文件——危害被执行力放大。缓解手段：RAG 提供事实依据、工具返回真实数据、关键步骤人工确认。",
      pm: "幻觉无法根除，只能管理。产品设计的问题不是「怎么消灭幻觉」，而是「哪些环节允许出错、错了怎么兜底、责任怎么划」。",
      fresh: "2026 年各家模型卡都开始标注「校准幻觉率」，可靠性指标首次进入营销话语。"
    },
    {
      id: "scaling", cat: "bench", zh: "Scaling Law 与后训练", en: "SCALING LAW",
      brief: "「堆更多数据和算力=更强模型」的经验定律，以及它放缓后的新故事。",
      body: "预训练 Scaling 在 2024 年后回报递减，行业转向后训练（RLHF、推理强化）和推理时计算（让模型多想）。「大力出奇迹」从训练阶段转移到了使用阶段。",
      pm: "对应用层的含义：模型代差在缩小、价格在跳水，「等下一代模型」不再是好策略——产品和数据壁垒比模型选择更重要。",
      fresh: "DeepSeek V4 以 1/34 的价格逼近旗舰，验证了「效率 Scaling」才是 2026 年的真主线。"
    },
    {
      id: "vibecoding", cat: "bench", zh: "Vibe Coding", en: "VIBE CODING",
      brief: "Karpathy 2025 年造的词：不看代码、全凭感觉指挥 AI 写软件。",
      body: "从调侃变成了真品类：Lovable、v0、Bolt 让不会写代码的人「说出一个应用」。专业开发侧对应的是 Claude Code、Cursor、Cline 等 Agentic Coding 工具。",
      pm: "对 PM 是超能力：原型不用再等排期，自己一晚上就能做出可交互 Demo 去验证需求。但生产代码仍需工程师把关——边界要拎清。",
      fresh: "2026 年「编程 Agent」是所有 Agent 赛道里商业化最成熟的一支，没有之一。"
    }
  ]
};
