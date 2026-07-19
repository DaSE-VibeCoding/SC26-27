import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo123456", 10);

  const demo = await prisma.user.upsert({
    where: { email: "demo@growmate.app" },
    update: {},
    create: {
      email: "demo@growmate.app",
      passwordHash,
      displayName: "演示用户",
      bio: "用记录沉淀成长，用陪伴对抗孤独。",
    },
  });

  const communities = [
    {
      slug: "growth",
      name: "成长日记",
      description: "分享感悟、复盘、人生经历与自我成长",
      icon: "sprout",
      tone: "supportive",
    },
    {
      slug: "mental",
      name: "情绪心理",
      description: "纯情绪出口，倾诉压力与心事，无评判交流",
      icon: "heart",
      tone: "healing",
    },
    {
      slug: "fitness",
      name: "运动体能",
      description: "训练打卡、健身经验、互相监督",
      icon: "dumbbell",
      tone: "training",
    },
    {
      slug: "nutrition",
      name: "饮食营养",
      description: "食谱分享、健康饮食、身材管理互助",
      icon: "apple",
      tone: "supportive",
    },
    {
      slug: "tech",
      name: "技术学习",
      description: "编程、Linux、AI 自学交流与答疑",
      icon: "code",
      tone: "learning",
    },
  ];

  for (const c of communities) {
    await prisma.community.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  const modules = [
    {
      slug: "fitness",
      name: "体能训练",
      description: "专业体能计划、居家/户外训练、体态矫正与科学打卡",
      courses: [
        {
          title: "零基础居家热身与体态唤醒",
          summary: "10 分钟唤醒身体，改善久坐圆肩",
          level: "beginner",
          durationMin: 15,
          order: 1,
          lessons: JSON.stringify([
            {
              title: "第一课：晨间唤醒与体态纠正",
              content: "课程目标：建立「每天都能完成」的最小训练单元。\n\n1. 颈肩环绕 1 分钟\n2. 开胸拉伸 2 分钟\n3. 深蹲激活 3 组×8\n4. 平板支撑 3×20 秒\n5. 训练后记录感受与完成度",
              codeExamples: [],
              exercises: [],
            },
          ]),
        },
        {
          title: "有氧耐力入门：间歇快走",
          summary: "用可控强度提升心肺与情绪稳定性",
          level: "beginner",
          durationMin: 25,
          order: 2,
          lessons: JSON.stringify([
            {
              title: "第一课：间歇快走方法",
              content: "方法：快走 3 分钟 + 慢走 2 分钟，循环 4 组。\n注意呼吸节奏，结束后写情绪打卡。",
              codeExamples: [],
              exercises: [],
            },
          ]),
        },
      ],
    },
    {
      slug: "nutrition",
      name: "营养搭配",
      description: "日常饮食、减脂增肌与健康习惯培养",
      courses: [
        {
          title: "一日三餐结构公式",
          summary: "蛋白质 + 蔬果 + 优质碳水的稳定搭配",
          level: "beginner",
          durationMin: 20,
          order: 1,
          lessons: JSON.stringify([
            {
              title: "第一课：均衡饮食搭配",
              content: "早餐：蛋白质 + 碳水\n午餐：蛋白质 + 蔬菜 + 碳水\n晚餐：蛋白质 + 大量蔬菜 + 少量碳水\n记录一周饮食，观察精力与情绪变化。",
              codeExamples: [],
              exercises: [],
            },
          ]),
        },
        {
          title: "情绪性进食识别与替代",
          summary: "把「解压吃」变成可执行的替代动作",
          level: "beginner",
          durationMin: 15,
          order: 2,
          lessons: JSON.stringify([
            {
              title: "第一课：识别情绪性进食",
              content: "识别触发：焦虑/无聊/疲惫。\n替代动作：喝水、散步 5 分钟、写 3 句情绪日记。",
              codeExamples: [],
              exercises: [],
            },
          ]),
        },
      ],
    },
    {
      slug: "tech",
      name: "技术学习",
      description: "计算机基础、Linux、Python、自动化与 AI 入门",
      courses: [
  {
    title: "Linux 基础入门",
    summary: "学习 Linux 操作系统的基本概念和常用命令",
    level: "beginner",
    durationMin: 45,
    order: 1,
    lessons: JSON.stringify([
      {
        title: "第一课：Linux 系统概述与文件操作",
        content: `Linux 是一个开源的操作系统内核，由 Linus Torvalds 于 1991 年创建。Linux 系统具有稳定性高、安全性好、免费开源等优点，广泛应用于服务器、嵌入式设备和桌面系统。

常见的 Linux 发行版包括 Ubuntu、CentOS、Debian 等。Ubuntu 适合新手，CentOS 常用于服务器，Debian 以稳定著称。

基础文件命令：
- ls：列出目录内容
- cd：切换目录
- pwd：查看当前路径
- mkdir：创建目录
- touch：创建文件
- cp：复制文件
- mv：移动/重命名
- rm：删除文件`,
        codeExamples: [
          { title: "文件与目录操作", description: "创建并管理项目目录结构", code: "# 创建项目目录\nmkdir -p ~/projects/linux-demo\n\n# 进入目录\ncd ~/projects/linux-demo\n\n# 创建文件\necho \"Hello Linux\" > hello.txt\n\n# 复制文件\ncp hello.txt backup.txt\n\n# 查看目录内容\nls -la\n\n# 删除文件\nrm backup.txt" },
        ],
        exercises: [
          { question: "创建一个名为 myapp 的目录，并在其中创建 index.html 文件", hint: "使用 mkdir 和 echo 命令", answer: "mkdir myapp && cd myapp && echo '<html></html>' > index.html" },
          { question: "查看当前目录下所有文件（包括隐藏文件）的详细信息", hint: "ls 命令有一个参数可以显示隐藏文件", answer: "ls -la" },
        ],
      },
      {
        title: "第二课：权限管理与用户系统",
        content: `Linux 是一个多用户操作系统，权限管理是其核心安全机制。

权限模型（rwx）：
- r：读取权限（4）
- w：写入权限（2）
- x：执行权限（1）
- 每个文件有三组权限：所有者、所属组、其他人

常用命令：
- chmod：修改权限
- chown：修改所有者
- useradd：添加用户
- passwd：设置密码
- whoami：查看当前用户`,
        codeExamples: [
          { title: "权限管理实战", description: "修改文件权限，理解 rwx 权限模型", code: "# 查看文件权限\nls -l hello.txt\n# 输出: -rw-r--r--  1 user  staff  12 Jul 19 10:00 hello.txt\n\n# 添加执行权限\nchmod +x hello.txt\n\n# 设置精确权限（所有者读写执行，组读执行，其他人读）\nchmod 754 hello.txt\n\n# 修改文件所有者\nsudo chown root hello.txt" },
        ],
        exercises: [
          { question: "将文件 permissions.txt 设置为仅所有者可读写", hint: "使用 chmod 600", answer: "chmod 600 permissions.txt" },
          { question: "创建一个新用户 devuser 并设置密码", hint: "使用 useradd 和 passwd 命令", answer: "sudo useradd devuser && sudo passwd devuser" },
        ],
      },
      {
        title: "第三课：管道、重定向与实用技巧",
        content: `管道和重定向是 Linux 命令行中最强大的功能之一，可以将多个命令组合使用。

重定向：
- >：将输出写入文件（覆盖）
- >>：将输出追加到文件
- 2>：将错误输出重定向

管道：
- 使用 | 将前一个命令的输出作为后一个命令的输入
- 可以无限级联

实用技巧：
- Tab 键自动补全
- Ctrl+C 终止，Ctrl+Z 暂停
- man 命令查看帮助
- history 查看历史命令`,
        codeExamples: [
          { title: "管道与重定向组合", description: "使用管道组合多个命令完成复杂任务", code: "# 统计当前目录文件数\nls -la | wc -l\n\n# 查找包含关键字的进程\nps aux | grep nginx\n\n# 将输出重定向到文件\nls -la > output.txt\n\n# 追加输出到文件\necho \"---END---\" >> output.txt\n\n# 统计日志中错误出现次数\ncat access.log | grep \"ERROR\" | wc -l" },
        ],
        exercises: [
          { question: "将 output.log 文件中所有包含 'success' 的行提取出来并统计行数", hint: "使用 grep 和 wc 配合管道", answer: "grep 'success' output.log | wc -l" },
          { question: "将系统所有进程信息保存到 processes.txt 文件中", hint: "使用 ps aux 和重定向", answer: "ps aux > processes.txt" },
        ],
      },
    ]),
  },
  {
    title: "Python 编程基础",
    summary: "掌握 Python 语言的基本语法和编程思维",
    level: "beginner",
    durationMin: 60,
    order: 2,
    lessons: JSON.stringify([
      {
        title: "第一课：变量、数据类型与输入输出",
        content: `Python 是一种高级编程语言，以其简洁的语法和强大的功能而闻名。

基本数据类型：
- 整数（int）：age = 25
- 浮点数（float）：price = 19.99
- 字符串（str）：name = "Python"
- 布尔值（bool）：is_ready = True

变量命名规则：
- 只能包含字母、数字和下划线
- 不能以数字开头
- 区分大小写
- 避免使用关键字

输入输出：print() 用于输出，input() 用于输入`,
        codeExamples: [
          { title: "变量与基本IO", description: "定义变量并与用户交互", code: "# 字符串格式化\nname = input(\"请输入你的名字: \")\nage = int(input(\"请输入你的年龄: \"))\n\nprint(f\"你好, {name}!\")\nprint(f\"你明年将 {age + 1} 岁\")\n\n# 类型转换\nprice = \"19.99\"\nprice_float = float(price)\nprint(f\"价格翻倍: {price_float * 2}\")" },
        ],
        exercises: [
          { question: "编写程序，从用户输入获取两个数字，输出它们的和", hint: "使用 input() 和 int() 转换", answer: "a = int(input('输入第一个数: '))\nb = int(input('输入第二个数: '))\nprint(f'和: {a + b}')" },
          { question: "将华氏温度转换为摄氏温度：C = (F - 32) * 5/9", hint: "使用 float 类型进行计算", answer: "f = float(input('华氏温度: '))\nc = (f - 32) * 5 / 9\nprint(f'摄氏温度: {c:.1f}')" },
        ],
      },
      {
        title: "第二课：条件判断与循环",
        content: `控制流程是编程的核心，让程序能够根据条件做出不同的决策。

条件判断（if-elif-else）：
- if 条件: 执行代码
- elif 条件: 另一个条件
- else: 以上都不满足

循环：
- for 循环：遍历序列
- while 循环：条件满足时持续执行
- range()：生成数列
- break：跳出循环
- continue：跳过本次循环`,
        codeExamples: [
          { title: "成绩等级判断", description: "使用 if-elif-else 判断成绩等级", code: "def get_grade(score):\n    if score >= 90:\n        return \"优秀\"\n    elif score >= 80:\n        return \"良好\"\n    elif score >= 70:\n        return \"中等\"\n    elif score >= 60:\n        return \"及格\"\n    else:\n        return \"不及格\"\n\nscores = [85, 92, 67, 78, 55]\nfor s in scores:\n    grade = get_grade(s)\n    print(f\"成绩 {s} 分: {grade}\")" },
        ],
        exercises: [
          { question: "编写程序，输出 1 到 100 之间所有能被 3 整除的数", hint: "使用 for 循环和 % 运算符", answer: "for i in range(1, 101):\n    if i % 3 == 0:\n        print(i)" },
          { question: "编写一个猜数字游戏：程序随机生成 1-100 的数，用户猜直到猜对", hint: "使用 random 模块和 while 循环", answer: "import random\nn = random.randint(1, 100)\nwhile True:\n    g = int(input('猜: '))\n    if g == n:\n        print('对了!')\n        break\n    elif g < n:\n        print('小了')\n    else:\n        print('大了')" },
        ],
      },
      {
        title: "第三课：函数与列表推导式",
        content: `函数是组织代码的基本单位，列表推导式是 Python 的优雅特性。

函数定义：
- 使用 def 关键字
- 可以设置默认参数
- 使用 return 返回值
- 支持文档字符串

列表推导式：
- 语法：[表达式 for 变量 in 序列]
- 可以加 if 条件过滤
- 比普通循环更简洁高效

常用内置函数：
- len()、sum()、max()、min()
- sorted()、enumerate()、zip()`,
        codeExamples: [
          { title: "函数与列表推导", description: "定义函数和使用列表推导式简化代码", code: "# 计算斐波那契数列\ndef fibonacci(n):\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(f\"斐波那契前10项: {fibonacci(10)}\")\n\n# 列表推导式\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nevens = [x for x in numbers if x % 2 == 0]\nsquares = [x**2 for x in numbers]\nprint(f\"偶数: {evens}\")\nprint(f\"平方: {squares}\")" },
        ],
        exercises: [
          { question: "编写函数 is_palindrome(s)，判断字符串是否为回文", hint: "比较字符串和它的反转", answer: "def is_palindrome(s): return s == s[::-1]" },
          { question: "用列表推导式生成 1-20 中所有奇数的平方", hint: "在推导式中使用 if 过滤", answer: "[x**2 for x in range(1, 21) if x % 2 == 1]" },
        ],
      },
    ]),
  },
  {
    title: "自动化脚本开发",
    summary: "学习使用 Python 进行系统自动化和任务自动化",
    level: "intermediate",
    durationMin: 75,
    order: 3,
    lessons: JSON.stringify([
      {
        title: "第一课：文件与目录自动化",
        content: `自动化脚本是提高工作效率的重要工具。Python 的 os 和 shutil 模块提供了丰富的文件和目录操作功能。

os 模块常用函数：
- os.getcwd()：获取当前目录
- os.listdir()：列出目录内容
- os.path.join()：拼接路径
- os.path.splitext()：分割文件名和扩展名

shutil 模块：
- shutil.copy()：复制文件
- shutil.move()：移动文件
- shutil.copytree()：复制整个目录
- shutil.rmtree()：删除目录树`,
        codeExamples: [
          { title: "批量文件整理", description: "按文件类型自动分类整理目录", code: "import os\nimport shutil\n\ndef organize(directory):\n    for f in os.listdir(directory):\n        path = os.path.join(directory, f)\n        if os.path.isfile(path):\n            ext = os.path.splitext(f)[1].lower()\n            target = os.path.join(directory, ext[1:])\n            os.makedirs(target, exist_ok=True)\n            shutil.move(path, os.path.join(target, f))\n            print(f\"移动: {f} -> {ext[1:]}/\")\n\norganize(\"./downloads\")" },
        ],
        exercises: [
          { question: "编写脚本，遍历当前目录下所有 .jpg 文件，移动到 images/ 文件夹", hint: "使用 os.listdir 和 shutil.move", answer: "import os, shutil\nos.makedirs('images', exist_ok=True)\nfor f in os.listdir('.'):\n    if f.endswith('.jpg'):\n        shutil.move(f, f'images/{f}')" },
        ],
      },
      {
        title: "第二课：定时任务与系统监控",
        content: `定时任务可以自动执行重复性工作。schedule 库提供了简单易用的定时调度功能。

schedule 基本用法：
- schedule.every(n).seconds/minutes/hours.do(job)
- schedule.every().day.at("HH:MM").do(job)
- schedule.run_pending()：检查并执行到期任务

系统监控：
- shutil.disk_usage()：磁盘使用情况
- psutil：更全面的系统监控（需安装）
- subprocess：执行系统命令`,
        codeExamples: [
          { title: "定时备份 + 磁盘监控", description: "每天定时备份 + 持续监控磁盘", code: "import shutil\nfrom datetime import datetime\nimport schedule\nimport time\n\ndef backup():\n    timestamp = datetime.now().strftime(\"%Y%m%d\")\n    shutil.make_archive(f\"backup_{timestamp}\", 'zip', './data')\n    print(f\"备份完成: backup_{timestamp}.zip\")\n\ndef check_disk():\n    usage = shutil.disk_usage('/')\n    percent = usage.used / usage.total * 100\n    print(f\"磁盘使用率: {percent:.1f}%\")\n    if percent > 90:\n        print(\"⚠️ 磁盘空间不足!\")\n\nschedule.every().day.at(\"18:00\").do(backup)\nschedule.every(30).minutes.do(check_disk)\n\nwhile True:\n    schedule.run_pending()\n    time.sleep(60)" },
        ],
        exercises: [
          { question: "编写定时任务，每 5 分钟检查一次磁盘使用率，超过 90% 打印告警", hint: "使用 schedule 和 shutil.disk_usage", answer: "import schedule, shutil\n\ndef check():\n    usage = shutil.disk_usage('/').used / shutil.disk_usage('/').total * 100\n    if usage > 90:\n        print(f'⚠️ 磁盘使用率: {usage:.1f}%')\n\nschedule.every(5).minutes.do(check)" },
        ],
      },
      {
        title: "第三课：日志分析与报告生成",
        content: `日志分析是运维中的重要任务。通过 Python 可以快速解析日志文件并生成报告。

日志分析要点：
- 使用 re 模块进行正则匹配
- 使用 Counter 进行统计
- 按时间范围过滤
- 提取关键错误信息

报告生成：
- 文本报告：直接输出到文件
- HTML 报告：使用模板生成
- 图表：使用 matplotlib 可视化`,
        codeExamples: [
          { title: "日志分析工具", description: "解析日志文件，提取关键指标并生成报告", code: "import re\nfrom collections import Counter\n\ndef analyze_log(log_file):\n    with open(log_file, 'r', encoding='utf-8') as f:\n        lines = f.readlines()\n    \n    levels = Counter()\n    errors = []\n    \n    for line in lines:\n        match = re.search(r'\\[(INFO|WARN|ERROR)\\]', line)\n        if match:\n            levels[match.group(1)] += 1\n            if match.group(1) == 'ERROR':\n                errors.append(line.strip())\n    \n    print(\"=\" * 40)\n    print(\"日志分析报告\")\n    print(\"=\" * 40)\n    print(f\"总行数: {len(lines)}\")\n    print(f\"INFO:  {levels.get('INFO', 0)}\")\n    print(f\"WARN:  {levels.get('WARN', 0)}\")\n    print(f\"ERROR: {levels.get('ERROR', 0)}\")\n    print(\"\\n错误详情:\")\n    for err in errors[:5]:\n        print(f\"  - {err}\")\n\nanalyze_log(\"app.log\")" },
        ],
        exercises: [
          { question: "编写日志监控脚本，实时监控日志新增内容，出现 'CRITICAL' 时立即通知", hint: "使用文件指针 seek 跟踪新增行", answer: "def watch(file):\n    with open(file, 'r') as f:\n        f.seek(0, 2)\n        while True:\n            line = f.readline()\n            if line and 'CRITICAL' in line:\n                print(f'🚨 严重告警: {line}')\n            else:\n                import time; time.sleep(1)" },
          { question: "统计 access.log 中每个 IP 的访问次数，输出前 5 名", hint: "使用正则提取 IP，用 Counter 统计", answer: "import re\nfrom collections import Counter\nips = re.findall(r'\\d+\\.\\d+\\.\\d+\\.\\d+', open('access.log').read())\nfor ip, cnt in Counter(ips).most_common(5):\n    print(f'{ip}: {cnt}')" },
        ],
      },
    ]),
  },
],
    },
    {
      slug: "mental",
      name: "心理健康",
      description: "情绪疏导、认知调整与轻量心理监护",
      courses: [
        {
          title: "情绪命名：把感受说清楚",
          summary: "降低内耗的第一步是准确描述情绪",
          level: "beginner",
          durationMin: 15,
          order: 1,
          lessons: JSON.stringify([
            {
              title: "第一课：情绪命名法",
              content: "练习：用「我现在感到…，因为…，我需要…」句式写 5 分钟。\n避免自我攻击式表达。",
              codeExamples: [],
              exercises: [],
            },
          ]),
        },
        {
          title: "焦虑时的 5 分钟着陆法",
          summary: "身体优先，思维随后",
          level: "beginner",
          durationMin: 10,
          order: 2,
          lessons: JSON.stringify([
            {
              title: "第一课：5-4-3-2-1 着陆技术",
              content: "1. 双脚踩实地面\n2. 吸气 4 秒，呼气 6 秒 × 8 轮\n3. 说出 5 个可见物体\n4. 写下一件「今天可控的小事」并完成",
              codeExamples: [],
              exercises: [],
            },
          ]),
        },
      ],
    },
  ];

  for (const mod of modules) {
    const module = await prisma.courseModule.upsert({
      where: { slug: mod.slug },
      update: {
        name: mod.name,
        description: mod.description,
      },
      create: {
        slug: mod.slug,
        name: mod.name,
        description: mod.description,
      },
    });

    // 删除旧课程重新创建，确保 lessons 数据更新
    await prisma.course.deleteMany({ where: { moduleId: module.id } });
    for (const course of mod.courses) {
      await prisma.course.create({
        data: { ...course, moduleId: module.id },
      });
    }
  }

  // demo 内容
  const journalCount = await prisma.journalEntry.count({
    where: { userId: demo.id },
  });
  if (journalCount === 0) {
    await prisma.journalEntry.createMany({
      data: [
        {
          userId: demo.id,
          title: "开启我的成长档案",
          content:
            "今天注册了伴成长。我想认真记录情绪、学习和训练，不再让日子无声滑过。有点紧张，但也期待被理解。",
          mood: 4,
          tags: JSON.stringify(["启程", "期待"]),
          isPrivate: true,
        },
        {
          userId: demo.id,
          title: "工作压力下的内耗",
          content:
            "下午会议后有些焦虑，脑子里循环「是不是做得不够好」。晚上跑步 20 分钟后好一些。需要建立复盘而不是自责的习惯。",
          mood: 2,
          tags: JSON.stringify(["焦虑", "复盘"]),
          isPrivate: true,
        },
        {
          userId: demo.id,
          title: "Python 学习打卡",
          content:
            "完成了变量和循环的练习，写了一个简单的待办脚本。虽然慢，但有掌控感。准备下周学 Linux 基础。",
          mood: 4,
          tags: JSON.stringify(["技术", "打卡"]),
          isPrivate: false,
        },
      ],
    });

    const now = Date.now();
    for (let i = 10; i >= 0; i--) {
      const score = i === 3 || i === 4 ? 2 : i === 7 ? 3 : 4;
      const stress = score <= 2 ? 4 : 2;
      await prisma.moodLog.create({
        data: {
          userId: demo.id,
          score,
          energy: score >= 4 ? 4 : 3,
          stress,
          note: score <= 2 ? "有点低落，压力偏大" : "状态还行",
          riskLevel: score <= 2 ? "watch" : "normal",
          createdAt: new Date(now - i * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  const growth = await prisma.community.findUnique({ where: { slug: "growth" } });
  const mental = await prisma.community.findUnique({ where: { slug: "mental" } });
  const tech = await prisma.community.findUnique({ where: { slug: "tech" } });

  const postCount = await prisma.post.count();
  if (postCount === 0 && growth && mental && tech) {
    await prisma.post.createMany({
      data: [
        {
          communityId: growth.id,
          authorId: demo.id,
          title: "把每天过成可回看的档案",
          content:
            "以前总觉得日记没用，直到发现「记录」本身就是抗遗忘、抗内耗的工具。欢迎和我一起坚持。",
          isAnonymous: false,
        },
        {
          communityId: mental.id,
          authorId: demo.id,
          title: "今天有点喘不过气",
          content:
            "不是大事，是很多小事叠在一起。写出来就好一点。如果有人看见，谢谢你愿意停一下。",
          isAnonymous: true,
        },
        {
          communityId: tech.id,
          authorId: demo.id,
          title: "零基础 Linux 学习路线求互助",
          content:
            "计划：命令行 → 文件权限 → shell 脚本。有没有一起打卡的伙伴？",
          isAnonymous: false,
        },
      ],
    });
  }

  console.log("Seed completed. Demo user: demo@growmate.app / demo123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
