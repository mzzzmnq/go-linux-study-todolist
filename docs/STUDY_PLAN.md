# Go + Linux：12 周详细学习计划

每周 8 项固定任务，合计 1200 分钟；共 12 周、96 项任务。步骤时长已包含在每项任务预算内。

## 怎么使用

先在 TodoList 中打开本周任务的“详细计划”，按顺序完成练习，满足验收条件后再勾选任务。本文与页面来自同一份课程数据，便于连续阅读。

日常使用 Ubuntu 终端。看板位于 `~/projects/go-linux-study-todolist`，自己编写的通讯录位于 `~/projects/contacts`，后续预约项目位于 `~/projects/lab-booking`。具体本机信息见 [LOCAL_SETUP.md](LOCAL_SETUP.md)。

先通过原有中文资料理解主题，再用每项任务的官方参考核对命令和 API。英文文档可配合浏览器翻译，只阅读本步骤相关章节，不要求全文通读。

命令中的 `<…>` 是待填写内容。先确认版本、文件名或测试值，再替换后执行；标明 PowerShell 的命令在 Windows 运行，其余命令按任务说明在 Ubuntu 中运行。

## 每周参考节奏

| 时间 | 安排 | 总分钟 |
| --- | --- | --- |
| 周一至周四 | 每天完成前 4 项中的一项 | 每天 180 |
| 周五 | 第 5 项 150 分钟 + 第 6 项前 30 分钟 | 180 |
| 周六 | 第 6 项余下 120 分钟 + 第 7 项前 60 分钟 | 180 |
| 周日 | 第 7 项余下 60 分钟 + 30 分钟复盘 + 30 分钟离屏休息 | 120 |

可按课程、实验和实习安排调换日期。任务超时先记录阻塞点和已经尝试的方法，再调整下一次练习；可选延伸和自定义任务从现有预算中调配。

## 笔记模板

```text
本次目标：
实际投入：__ 分钟
我运行了什么：
实际输出或验收结果：
遇到的错误与原因：
我尝试的修复及结果：
仍未解决的问题：
下次从哪一步继续：
```

## 周次导航

- 第 1 周：搭好环境，写出第一个 Go 通讯录
- 第 2 周：把通讯录保存成 JSON
- 第 3 周：给通讯录提供 HTTP API
- 第 4 周：把通讯录迁移到 MySQL
- 第 5 周：开始实验室设备预约项目
- 第 6 周：完善登录与预约权限
- 第 7 周：解决并发预约与事务问题
- 第 8 周：补齐测试，交付预约项目第一版
- 第 9 周：为设备列表加入可验证的缓存
- 第 10 周：用 Docker 在本机复现运行环境
- 第 11 周：集中排错与模拟面试
- 第 12 周：完成交付，形成持续投递节奏

## 第 1 周：搭好环境，写出第一个 Go 通讯录

目标：从只会 cd、ls 起步，在 Ubuntu 上运行 Go CLI，建立可复现的学习和 Git 习惯。

### w01-t01 · 准备 Ubuntu、Go 和项目目录（180 分钟）

操作：在 Ubuntu 中建立 ~/projects，检查 go version、git --version，创建 contacts 项目并运行 go mod init contacts 和 hello.go。安装方法以当前官方工具输出为准，教程截图只作参考。验收：终端能执行 go run .，笔记记录系统、Go 版本和源码路径。

**学习目标：** 验证已经安装好的 WSL Ubuntu、Go、Git 与 VSCode 连接，分清 Windows/Ubuntu 两套路径，亲手写出并运行 HelloWorld；环境检查只读，不重装工具，也不改 TodoList 源码或 data。

**开始前确认**

- 本机 Ubuntu 24.04.5 的用户名为 caolingyun；Go 1.27.2、Git 和 nano 已核实可用。VS Code 的 WSL/Go 扩展及 gopls/dlv 按需另行核验和配置。
- TodoList 位于 ~/projects/go-linux-study-todolist；通讯录作业独立放 ~/projects/contacts。

**操作步骤**

1. **确认进入的是 Ubuntu 终端 · 25 分钟**

   - 在 Windows Terminal 打开 Ubuntu 标签页，或先在 PowerShell 执行 wsl -d Ubuntu-24.04 -u caolingyun；之后本任务命令都在 Ubuntu 终端执行。
   - 执行身份和系统检查，预期 whoami 为 caolingyun、系统信息含 Ubuntu 24.04；只记录实际版本，不为匹配截图重装。
   - 若看到 C:\ 路径或命令不认识，先确认终端类型；Go 检查失败时记录 which/输出，把问题定位到当前发行版或 PATH。

   ```text
   whoami
   pwd
   cat /etc/os-release
   go version
   git --version
   command -v go
   ```

2. **画出两个文件系统与目录边界 · 30 分钟**

   - 理解 ~ 在当前用户下代表 /home/caolingyun；/mnt/c 是 Windows C 盘入口，D:\Codex_project 属于 Windows 路径，对应 /mnt/d/Codex_project。
   - 只读查看现有 TodoList 目录，再建立独立 contacts 目录；每次操作前用 pwd 确认，不能进入 TodoList/data 写练习文件。
   - 已配置 VS Code WSL 扩展时从 contacts 执行 code .，确认左下角为 WSL: Ubuntu-24.04；未配置时先用 nano main.go 编辑，终端 pwd 应为通讯录目录。

   ```text
   ls -ld ~/projects/go-linux-study-todolist
   mkdir -p ~/projects/contacts
   cd ~/projects/contacts
   pwd
   # 仅已配置 VS Code WSL 扩展时执行；否则可用 nano main.go：
   code .
   ```

3. **阅读入口结构并自己写 HelloWorld · 55 分钟**

   - 只读官方入门的 Write some code，理解 package main、import、func main、fmt.Println 各负责什么；先不引入第三方包。
   - 先用 ls -a 检查目录；只有没有 go.mod 时执行 go mod init contacts，已有文件就检查 module 行，不能覆盖先前作业。
   - 在 VSCode 手动新建 main.go，合上示例后自行输入入口函数和打印语句；输出包含自己的姓名缩写和今天日期。
   - 对比 Python 可直接执行脚本、动态类型与 Go 编译检查、显式包和函数入口；对照 C 的 main 理解入口而非照抄。

   ```text
   cd ~/projects/contacts
   ls -a
   go mod init contacts
   ```

4. **运行、故意出错与修正 · 40 分钟**

   - 保存文件后运行 go run .，预期终端出现一行自选问候；首次编译可能稍慢，先等输出，不重复安装。
   - 故意拼错一次 Println 或删除引号，读报错的文件名、行号、说明，然后自己修复；再试一次未使用变量的编译错误。
   - 执行格式化，再编译到 contacts-demo，运行二进制并比较 go run 与 go build 的产物；把二进制留在练习目录。

   ```text
   cd ~/projects/contacts
   go run .
   gofmt -w main.go
   go build -o contacts-demo .
   ./contacts-demo
   ```

5. **独立复现与留下环境卡 · 30 分钟**

   - 关闭再打开 Ubuntu 终端，从家目录独立进入 contacts 并运行；能解释 pwd、go.mod、main.go 分别是什么。
   - 写环境卡记录实际用户名、系统/Go版本、两个项目绝对路径、启动命令和一次报错；不要把长篇安装教程抄入笔记。
   - 用自己的话说明终端负责执行命令、编辑器负责改源码；核对 TodoList 源码和 data 未参与练习。

   ```text
   cd ~/projects/contacts
   pwd
   go run .
   cat go.mod
   ```

**完成后逐项验收**

- Ubuntu 中 whoami、Go 和 Git 版本检查有真实输出记录。
- 说清 /home/caolingyun/projects/contacts 与 Windows 路径的关系，并能从新终端进入。
- 自己编写的 main.go 可运行，输出个人化问候；编译产物也可单独执行。
- 能复述并修复至少两条编译错误，未修改 TodoList/data。

**保留的学习产物**

- contacts/main.go 与 go.mod；源码由自己输入并解释。
- 环境与路径卡，附终端输出及两次报错修正。

**问题排查**

- go run . 提示找不到 go.mod，或终端路径仍是 C:\Users。：确认 Ubuntu 终端，cd ~/projects/contacts 后 pwd/ls -a；仅在正确且尚无 go.mod 的目录初始化模块。
- 修改代码后输出没变，或提示 main 重复定义。：先保存文件并核对执行目录；同目录所有 .go 都参与构建，只保留一个 main 入口，不再额外放 hello.go 的重复入口。

**复盘问题**

- Go 的未使用变量错误与 Python 执行阶段报错有什么不同？
- 如果明天从新终端开始，最少哪三个检查能确保没有改错项目？

**参考资料**

- [计算机教育中缺失的一课](https://missing-semester-cn.github.io/)
- [Go 官方入门：只读 Write some code 段](https://go.dev/doc/tutorial/getting-started)

**可选延伸（从已有预算中调配时间）**

- 非必做：试用一次已安装的 VSCode Go 调试功能，理解断点；从最后30分钟里调配10分钟，不加时。

### w01-t02 · 用已有 C/Python 基础学习 Go 基本语法（180 分钟）

操作：练习变量、类型、if、for、函数、切片和 map，各写一个小程序；比较 Go 与 C/Python 的不同。验收：不用复制教程，写出统计 10 个姓名出现次数的函数并解释返回值。

**学习目标：** 把已有 C/Python 语法经验迁移到 Go，掌握静态类型、零值、流程控制、函数、切片与 map，用姓名计数练习连接语言机制和实际数据。

**开始前确认**

- 上一任务能在 Ubuntu 的 ~/projects/contacts 运行 Go；本项命令继续在 Ubuntu 终端执行。
- 能用 C/Python 写简单循环、函数和字典；不要求提前学习并发。

**操作步骤**

1. **限定阅读范围与语法对照 · 20 分钟**

   - 阅读 Go Tour 的变量/类型/零值、for/if、函数、slice、map 小节；每节先预测例子输出再运行。
   - 笔记列 C/Python→Go 对照：:= 只在函数内、无隐式数字转换、for 统一循环形式、函数可返回多个值。
   - 理解 Go 零值，不把 Python 的 None 或 truthiness 规则直接搬过来；空字符串和0不是布尔表达式。

   ```text
   cd ~/projects/contacts
   go doc builtin
   ```

2. **变量、分支与函数小实验 · 35 分钟**

   - 在独立 exercises/basics 目录写短程序，避免与根目录 main 冲突；声明 int/string/bool，打印类型和值。
   - 亲手写判断姓名是否为空的函数和计数函数骨架；尝试把 int 与 float64 相加，观察后显式转换。
   - 对比函数参数与返回值声明位置，并做一次接收两个返回值的调用；不用复制完整教程答案。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/basics
   go run ./exercises/basics
   ```

3. **切片、map 与姓名计数 · 60 分钟**

   - 先画切片的长度/容量概念，再给10个自拟虚构姓名建立切片，含重复、空字符串和中文姓名。
   - 用 make 创建 map[string]int，写姓名计数函数；先明确空姓名是否忽略，再编码，输出计数而非依赖 map 遍历顺序。
   - 用 range 遍历，并解释索引和值；用第二返回值判断 map 键存在，理解不存在键读取到零值。
   - 把Python字典版思路写成三句，再自行翻译为Go；本阶段不学习泛型，不引入第三方集合库。

   ```text
   cd ~/projects/contacts
   go doc builtin.make
   go doc builtin.append
   go run ./exercises/basics
   ```

4. **输入边界与报错定位 · 40 分钟**

   - 给空切片、全部同名、全部不同、中文姓名分别写预期计数；先手算再运行核对。
   - 故意对 nil map 赋值，再改成初始化后的 map；记录编译错误与运行时 panic 的区别。
   - 查看类型不匹配、未使用导入的报错，按行修复；不要为消除错误盲目添加下划线。

   ```text
   cd ~/projects/contacts
   gofmt -w exercises/basics/main.go
   go run ./exercises/basics
   ```

5. **脱离资料复写与整理 · 25 分钟**

   - 合上网页，在草稿上写出姓名计数函数签名、循环和返回值含义，再对照已写代码。
   - 整理六项语法卡，给每项保留一个真实输入输出；解释哪些写法与 Python 相似、哪些必须改变。
   - 核对练习入口在子目录，根通讯录仍能启动；保存最初错误，不只保存最终成功截图。

   ```text
   cd ~/projects/contacts
   go run .
   go run ./exercises/basics
   ```

**完成后逐项验收**

- 姓名计数函数处理10个姓名，输出与手算一致，规则解释清楚。
- 空输入、重复姓名、中文姓名有可见运行结果。
- 能解释 map 不存在键的零值和存在标记，不依赖遍历顺序。
- 能举例说明 Go 静态类型、零值和多返回值与 Python 的差异。

**保留的学习产物**

- exercises/basics 下的可运行语法练习和姓名计数函数。
- 语法对照卡及四类边界输入输出。

**问题排查**

- 多个小练习都放根目录，报 main redeclared。：每个可执行练习放不同子目录，以 go run ./exercises/basics 运行；根目录保留通讯录入口。
- 给 nil map 赋值 panic，或计数输出顺序每次不同。：写入前 make 初始化；验证键值集合，不把 map 遍历顺序当作业务承诺，需要稳定输出再排序键。

**复盘问题**

- 为什么读取不存在的键不会报错，而向 nil map 写入会失败？
- 切片与 Python list 的哪些表面相似不能当作完全相同？

**参考资料**

- [Go by Example 中文](https://gobyexample-cn.github.io/)
- [Go 官方 Tour：Basics 与 More types](https://go.dev/tour/basics/1)

**可选延伸（从已有预算中调配时间）**

- 非必做：加一个过滤空白姓名的函数，从边界验证40分钟中调整10分钟，不增加总预算。

### w01-t03 · 实现内存通讯录 CLI（180 分钟）

操作：定义 Contact 结构体，用切片保存姓名、电话，提供新增、列表和按姓名查询命令；先只保存在内存。验收：终端新增 3 条联系人，可查到指定记录，退出后数据消失的原因能说清。

**学习目标：** 用结构体、切片、函数和命令循环做出只保存在内存的通讯录；把需求拆成可运行的小增量，不直接照抄完整成品。

**开始前确认**

- 姓名计数练习已完成，能理解切片与函数返回值。
- 保留根目录唯一 main 入口；所有人名电话均用虚构样例。

**操作步骤**

1. **把需求写成三条用例 · 20 分钟**

   - 阅读已有中文资料的结构体、切片、函数段；对照 Tour 的 Structs 和 Slices，暂不阅读Web框架。
   - 约定 add/list/find/quit 四个命令和一条虚构联系人示例；先决定同名查询返回第一条还是所有匹配记录。
   - 画出输入→命令分发→联系人切片→输出流程，明确退出后数据消失是当前阶段的预期行为。

   ```text
   cd ~/projects/contacts
   ```

2. **定义数据与最小列表 · 35 分钟**

   - 自己定义 Contact 结构体，先只有姓名和电话，电话用 string 以保留前导零；写两个虚构初始化数据。
   - 先实现 list，不用马上做完整交互；观察空切片和两条记录的输出，保证提示可读。
   - 将列表函数与 main 的控制流程区分；每增加一个函数先 go run 检查，而非写完180分钟才运行。

   ```text
   cd ~/projects/contacts
   go run .
   ```

3. **逐项实现新增与查询 · 60 分钟**

   - 根据自己写的签名实现新增，把新记录 append 到切片；确认修改结果传回调用方，避免只改局部切片。
   - 用线性遍历实现按姓名查询，复用第一阶段语法；为未找到情况明确返回结果和提示。
   - 把命令循环接进已有 main；此项可先用基础输入读取，含空格的行输入在下项专门改进。
   - 每完成一项就新增、列表、查询一次；把所有业务代码限制在通讯录，不调用 TodoList 的内部代码。

   ```text
   cd ~/projects/contacts
   gofmt -w main.go
   go run .
   ```

4. **按用例演示并找边界 · 40 分钟**

   - 新增3条虚构联系人，列表观察数量和字段，再查询已有与不存在姓名；记录命令序列及预期输出。
   - 测试空列表和重复姓名，检查是否符合事先规则；把规则不清的问题写到README而非临时偷偷改变。
   - 退出进程并重新启动，验证内存数据消失；解释文件没有自动保存，不能把这当成操作系统故障。

   ```text
   cd ~/projects/contacts
   go run .
   ```

5. **整理结构和下一步清单 · 25 分钟**

   - 用纸画 Contact 与 []Contact 的关系，指出列表、添加、查找各遍历了什么。
   - 整理README启动命令与3条用例；记录目前不能持久化、不能可靠读取含空格姓名的限制。
   - 脱离代码口述一次添加数据的流向，标记不能解释的语句并回看官方小节。

   ```text
   cd ~/projects/contacts
   go build -o contacts-demo .
   ./contacts-demo
   ```

**完成后逐项验收**

- CLI 能新增3条记录、列表显示并按姓名查询成功。
- 空列表和不存在姓名有明确输出，重复姓名遵守既定规则。
- 退出重启后记录消失，能解释内存与持久化区别。
- 主流程和业务函数可分别指出，代码能格式化与构建。

**保留的学习产物**

- 内存版通讯录源码与启动README。
- 三条主用例和两条边界演示记录。

**问题排查**

- 新增打印成功，但随后列表仍没有该联系人。：检查 append 返回的新切片是否写回调用方；切片长度改变不会自动反映到按值传入的调用变量。
- 电话首位0消失，姓名有空格时读取异常。：电话改用字符串；空格输入暂记录为限制，下项统一改为按行读取，避免在本项堆叠多个输入库。

**复盘问题**

- 为什么 append 后必须使用返回的切片？
- 如果明天要保存到磁盘，哪些业务函数可以复用，哪些输入输出职责需要分开？

**参考资料**

- [李文周 Go 学习目录](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 Tour：Basics 与 More types](https://go.dev/tour/basics/1)

**可选延伸（从已有预算中调配时间）**

- 非必做：加按电话查询，仅从实现60分钟内调配10分钟，核心三项功能先验收。

### w01-t04 · 处理 CLI 输入与错误（180 分钟）

操作：使用 bufio 读取输入，校验空姓名、空电话与未知命令；用返回 error 的函数拆分新增和查询。验收：至少执行 5 个错误输入，程序不崩溃且给出可理解的提示。

**学习目标：** 用 bufio 按行读取终端输入，把输入校验与业务 error 返回分开；让错误成为可理解的提示，而不是程序崩溃或无限循环。

**开始前确认**

- 内存通讯录已有新增、列表和查找函数。
- 理解函数多返回值；命令在 Ubuntu 的 ~/projects/contacts 中执行。

**操作步骤**

1. **理解输入流与error路径 · 20 分钟**

   - 阅读原中文资料的错误处理、字符串与bufio示例；用终端 go doc 查看 Scanner 和 Scan，不需要浏览全部标准库。
   - 画出 stdin→Scanner→TrimSpace→校验→业务函数→用户提示，说明错误不等于 panic。
   - 确定空姓名、空电话、不存在记录、未知命令的响应；电话先约定为非空字符串，不做未经需求证明的国家号码规则。

   ```text
   cd ~/projects/contacts
   go doc bufio.Scanner
   go doc strings.TrimSpace
   go doc errors.New
   ```

2. **逐行读取并统一清理 · 35 分钟**

   - 用同一个 Scanner 读取命令、姓名和电话，输入含空格的虚构姓名观察整行保留；只裁剪首尾空白。
   - 每次 Scan 后检查是否读取成功，循环结束后检查 Err；遇到终端 EOF 正常退出而非继续索要输入。
   - 把读取一行的细节整理为小函数或清晰流程，避免混用 fmt.Scan 与Scanner导致剩余换行干扰。

   ```text
   cd ~/projects/contacts
   go run .
   ```

3. **把校验与业务返回值接起来 · 60 分钟**

   - 改新增函数使校验失败返回error，成功才改变联系人集合；错误信息说明可修正的字段。
   - 让查询函数明确区分找到记录和不存在，主程序按返回值打印；不让底层函数直接退出整个进程。
   - 主循环遇到未知命令打印支持列表，然后允许下一条有效命令；含空格姓名能正常添加与查询。
   - 每种错误先写预期，再实现最小判断，不用正则、框架或一堆异常捕获模拟Python。

   ```text
   cd ~/projects/contacts
   gofmt -w main.go
   go run .
   ```

4. **执行五类失败并验证恢复 · 40 分钟**

   - 依次试空姓名、只含空格的姓名、空电话、未知命令、不存在姓名，随后追加有效联系人检查状态。
   - 在 Ubuntu 终端空输入位置按 Ctrl+D 测EOF；用输入重定向从虚构样例文件重跑同一命令序列。
   - 检查失败后切片数量未变化、程序可继续；如果Scanner报错，保留原始错误用于诊断，不只写读取失败。

   ```text
   cd ~/projects/contacts
   go run . < input-cases.txt
   ```

5. **更新输入契约并独立演示 · 25 分钟**

   - 写输入规范，区分空值、前后空白、内部空格、重复姓名和EOF；输入样例只含虚构个人信息。
   - 脱离笔记演示错误→修正→成功三步，用自己的话解释为什么返回error比panic更适合用户输入错误。
   - 留两条后续测试候选，下一周再学testing，不在这里直接引入完整测试框架。

   ```text
   cd ~/projects/contacts
   go build -o contacts-demo .
   ```

**完成后逐项验收**

- 五类错误输入均给出明确提示，随后有效命令仍可执行。
- 含空格姓名可完整新增与查询，前后空白按文档处理。
- EOF能正常退出，Scanner.Err路径被检查。
- 新增失败不修改集合，业务函数通过error返回错误。

**保留的学习产物**

- 按行读取与错误处理后的通讯录源码。
- input-cases.txt、预期输出和输入规范笔记。

**问题排查**

- 姓名刚开始输入就被跳过，或出现残余换行。：统一使用同一个按行读取器，移除混用的 fmt.Scan；逐次记录输入流消费位置。
- 按Ctrl+D后无限打印提示，或失败新增留下半条数据。：Scan返回false立即结束读取并检查Err；完整校验通过后才执行append，不边读边修改集合。

**复盘问题**

- EOF与读取失败各应该如何影响程序退出？
- 哪些错误由用户纠正，哪些应保留底层原因便于程序员定位？

**参考资料**

- [Go by Example：错误处理与字符串](https://gobyexample-cn.github.io/)
- [Go 官方 Tour：Basics 与 More types](https://go.dev/tour/basics/1)

**可选延伸（从已有预算中调配时间）**

- 非必做：设置Scanner缓冲上限并测试长输入，从失败验证40分钟里调整10分钟。

### w01-t05 · 掌握文件、路径和终端帮助（150 分钟）

操作：练习 pwd、mkdir、cp、mv、cat、less、find、man，分别定位源码与工作目录；只在练习目录操作。验收：独立复制项目到临时目录，用终端找到 main.go，并说明相对路径与绝对路径。

**学习目标：** 把会用 cd/ls 扩展到理解工作目录、复制移动、读取与查找文件、终端帮助；所有改变文件的操作限制在独立练习目录。

**开始前确认**

- 已分清 Ubuntu 家目录与Windows挂载路径。
- 通讯录存在 ~/projects/contacts，TodoList/data 不能作为练习对象。

**操作步骤**

1. **认识路径与帮助入口 · 20 分钟**

   - 在Ubuntu终端先pwd，比较 .、..、~ 与绝对路径；画家目录→projects→contacts树。
   - 用 man 阅读命令 NAME/SYNOPSIS/常用选项，不通读整页；less 中空格下一页、/搜索、q退出。
   - 先预测 cd 后 pwd，再执行验证，确认相对路径依赖当前目录。

   ```text
   cd ~/projects/contacts
   pwd
   man cp
   man find
   ```

2. **建立可核对的练习目录 · 30 分钟**

   - 只在 contacts/exercises/files 下操作，建 source 与 backup 两个子目录，用虚构文本作素材。
   - 分别执行cp和mv，操作前后用ls观察；比较复制保留来源、移动改变目录项，理解覆盖风险。
   - 做一次包含空格文件名练习，路径加引号；本项不删除整个目录，也不使用rm -rf。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/files/source exercises/files/backup
   printf 'practice only\n' > exercises/files/source/note.txt
   cp exercises/files/source/note.txt exercises/files/backup/
   mv exercises/files/backup/note.txt exercises/files/backup/moved.txt
   ```

3. **读取、查找与限定范围复制 · 45 分钟**

   - 用cat读取短文本、less查看较长文件；说明cat与less的适用范围。
   - 在contacts中用find按文件名查找main.go，用 -type f 避免把目录当文件；记录查找起点会影响结果。
   - 先检查backup不存在名为snapshot的目录，再将通讯录源文件与go.mod复制进去；不复制TodoList及其data。
   - 比较原文件与副本内容，指出相对路径和绝对路径两种写法；不要在包含自身的目录内递归复制整个项目。

   ```text
   cd ~/projects/contacts
   cat exercises/files/source/note.txt
   less main.go
   find . -type f -name 'main.go'
   mkdir -p exercises/files/snapshot
   cp main.go go.mod exercises/files/snapshot/
   ```

4. **设计两次失败并查帮助 · 35 分钟**

   - 输入不存在路径观察No such file or directory，先pwd再ls父目录定位，而非重新安装命令。
   - 把带空格路径不加引号试一次，读参数被拆分的现象，再加引号修复。
   - 用man确认 cp -i 或 mv -i 的覆盖提示；只对练习文本使用，取消覆盖后检查原内容仍在。

   ```text
   cd ~/projects/contacts
   cp -i exercises/files/source/note.txt exercises/files/backup/moved.txt
   man mv
   find ~/projects/contacts -type f -name 'main.go'
   ```

5. **从新终端完成小验收 · 20 分钟**

   - 从家目录用绝对路径找到通讯录入口，再切到项目用相对路径找到同一文件。
   - 自己口述并完成复制一份main.go到练习snapshot，检查目的地后再执行；记录命令、结果、误操作防线。
   - 写一张8条命令卡，每条包含用途、目录上下文和一个真实示例。

   ```text
   cd ~
   find ~/projects/contacts -maxdepth 1 -type f -name 'main.go'
   cd ~/projects/contacts
   pwd
   ```

**完成后逐项验收**

- 能解释并验证相对路径、绝对路径、~、.、..。
- 独立把main.go/go.mod复制到练习目录，原项目仍运行。
- 会在less/man中搜索和退出，find只查指定项目范围。
- 两次路径失败均有原因与修正记录，未操作TodoList/data。

**保留的学习产物**

- exercises/files 下的练习文本与源码副本。
- 命令卡和两次路径失败排查记录。

**问题排查**

- find . 看不到main.go，或复制到了意料之外的位置。：先pwd确定查找起点与相对目标；用目的目录的绝对路径核对，再执行ls。
- 复制整个contacts到自身子目录导致递归包含。：本项仅复制明确的源文件；若做项目快照，目的地应放项目外且先核实目录边界，不用递归删除补救。

**复盘问题**

- 为什么相同的 cp main.go backup/ 在两个目录执行结果不同？
- 如何在不了解选项时从man中快速找到所需内容？

**参考资料**

- [缺失的一课：Shell 与工具](https://missing-semester-cn.github.io/)
- [缺失的一课中文：Shell工具与脚本](https://missing-semester-cn.github.io/2020/shell-tools/)

**可选延伸（从已有预算中调配时间）**

- 非必做：用 diff 比较两份练习文本，从失败排查35分钟中调整10分钟。

### w01-t06 · 数组、复杂度与两道基础题（150 分钟）

操作：用 Go 写线性查找和二分查找，手画执行过程；对各做 3 组边界输入。验收：能解释 O(n)、O(log n) 及二分查找的排序前提，保留可运行代码和错题笔记。

**学习目标：** 用切片实现线性查找和有序切片二分查找，先手算再编码；把大O解释为输入增长趋势，明确边界与二分的排序前提。

**开始前确认**

- 会for、if、切片索引和函数返回值。
- 练习独立放 contacts/exercises/search，避免根目录入口冲突。

**操作步骤**

1. **写清接口与比较次数 · 20 分钟**

   - 阅读原中文资料的数组、切片、函数段；先不做题库排行榜或背答案。
   - 约定输入整数切片和目标值，返回索引与是否找到；重复值允许返回任意匹配索引。
   - 手画长度8的有序数组，计算线性最坏比较8次、二分每次缩小区间；区分时间和额外空间。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/search
   ```

2. **线性查找先走通 · 30 分钟**

   - 自己写线性函数，逐项比较找到即返回；空输入无需访问任何索引。
   - 给[3,1,3]找1与找3手写预期；用输出确认第一次匹配策略。
   - 说明O(n)与输入长度关系，不能把一组耗时当作复杂度证明。

   ```text
   cd ~/projects/contacts
   go run ./exercises/search
   ```

3. **手画并实现二分 · 45 分钟**

   - 选闭区间[lo,hi]或半开区间中的一种并写在注释里，先手画每轮边界与mid。
   - 自行编码二分，不复制完整实现；每次分支必须缩小区间，找不到按约定返回。
   - 用mid=lo+(hi-lo)/2理解索引计算；只有排序输入才使用二分，不暗中排序改变原问题。
   - 对同一有序输入比较两函数返回，说明二分通常O(log n)、循环额外空间O(1)。

   ```text
   cd ~/projects/contacts
   gofmt -w exercises/search/main.go
   go run ./exercises/search
   ```

4. **边界用例与故障定位 · 35 分钟**

   - 两函数分别跑空切片、单元素命中/不命中、目标在首尾、目标不存在；至少保留3组核心边界。
   - 给二分加临时边界日志，观察区间每轮缩小；若卡住，用Ctrl+C停止并分析更新式。
   - 故意输入未排序切片，记录错误答案可能发生而非一定发生；标注这是违反前提，不修成无条件正确。

   ```text
   cd ~/projects/contacts
   go run ./exercises/search
   ```

5. **合上代码解释与留错题 · 20 分钟**

   - 脱离代码画一次二分找不到的过程，说明终止时区间是什么。
   - 整理每题思路、函数、边界输入、预期/实际、最初错误；删除临时调试输出或加开关。
   - 比较切片连续索引与后续链表访问差异，停留在概念，不追加新题。

   ```text
   cd ~/projects/contacts
   go run ./exercises/search
   ```

**完成后逐项验收**

- 两道题有独立实现，空输入与首尾目标结果正确。
- 能说明二分排序前提和选定区间约定。
- 至少3组边界输入有手算与运行对照。
- 解释O(n)、O(log n)与循环额外空间，不以单次耗时代替证明。

**保留的学习产物**

- exercises/search 可运行的两个函数与用例。
- 二分手画过程和错题笔记。

**问题排查**

- 二分死循环，lo或hi更新后仍包含同一个mid。：检查区间约定与循环条件，逐轮打印lo/hi/mid，保证排除已比较且不匹配的mid。
- 空切片触发索引越界，或对未排序输入得出错误结论。：先判断循环是否有合法区间再访问索引；把排序前提写在函数契约，测试明确区分合法与非法输入。

**复盘问题**

- 为什么二分查找不能直接用于任意通讯录切片？
- 如果找到重复值就返回，结果正确与返回最左位置是同一要求吗？

**参考资料**

- [Go by Example：切片与函数](https://gobyexample-cn.github.io/)
- [Go 官方 Tour：Basics 与 More types](https://go.dev/tour/basics/1)

**可选延伸（从已有预算中调配时间）**

- 非必做：统计比较次数验证增长趋势，从边界验证35分钟调整10分钟。

### w01-t07 · 第一次 Git 提交与学习记录（120 分钟）

操作：git init，添加 .gitignore，学习 status、diff、add、commit、log；写明启动方法并提交当前通讯录。验收：仓库至少 2 次有意义的提交，能从 diff 解释每次改动，没有把二进制或个人数据加入 Git。

**学习目标：** 只为独立contacts练习建立Git仓库，通过工作区、暂存区、提交三个状态保存可解释的改动，并排除编译产物与个人数据。

**开始前确认**

- 通讯录及练习源码已能运行。
- 不在TodoList仓库执行本项；Git已安装，不需要重复配置系统环境。

**操作步骤**

1. **阅读Git三种状态与检查边界 · 20 分钟**

   - 阅读Git官方gittutorial的初始化、查看差异、提交段；画工作区→add→暂存区→commit→历史。
   - 在contacts先pwd与git rev-parse --show-toplevel；若已有仓库，确认仓库根路径后复用，不能在TodoList初始化。
   - 查看仓库身份配置是否存在；缺失时用自己的姓名与可公开邮箱在本仓库设置，不输出令牌。

   ```text
   cd ~/projects/contacts
   pwd
   git rev-parse --show-toplevel
   git config --get user.name
   git config --get user.email
   ```

2. **初始化并规划忽略项 · 35 分钟**

   - 只有contacts尚无.git时执行git init，检查当前分支名，不假设必定main/master。
   - 自己编写.gitignore，忽略contacts-demo、运行产生的contacts.json、日志与本地配置；源码、go.mod、README应跟踪。
   - 建立README写Ubuntu环境、启动步骤和当前内存限制；git status检查是否意外出现私人通讯录或缓存。

   ```text
   cd ~/projects/contacts
   git init
   git status --short
   git diff
   ```

3. **两次有意义提交并读diff · 40 分钟**

   - 先明确添加源码与README，读暂存差异再提交内存CLI；不要用一次git add .掩盖不熟悉的文件。
   - 做一处可观察的小改动，如改善未知命令提示或补输入样例，运行验证后再提交第二次。
   - 给每次提交写描述行为的消息；理解commit仅保存本地历史，尚不等于推送到GitHub。
   - 查看log和某次show，能逐行说明第二次改了什么；提交前再次确认无二进制、真实电话或秘密。

   ```text
   cd ~/projects/contacts
   git add main.go go.mod README.md .gitignore
   git diff --cached
   git commit -m 'Add in-memory contacts CLI'
   git status --short
   git log --oneline -5
   ```

4. **回看历史与建立学习记录 · 25 分钟**

   - 在README或notes写今天真实投入、一次Go错误和一次路径错误，不把全套工具输出当学习结论。
   - 用git diff查看未提交学习记录，暂存后提交；如果工作区干净，说明这代表提交后无改动。
   - 从新终端启动通讯录并查看历史，演示两次以上有意义提交和被忽略的编译文件。

   ```text
   cd ~/projects/contacts
   git status
   git diff
   git log --oneline
   git check-ignore contacts-demo
   go run .
   ```

**完成后逐项验收**

- contacts有独立仓库，根路径不指向TodoList。
- 至少两次有意义提交，可用log/show解释改动。
- README足以启动CLI，源码与go.mod已跟踪。
- 编译产物、运行数据与本地凭据未被提交。

**保留的学习产物**

- contacts的Git历史、.gitignore和README。
- 学习记录，含一次暂存diff解读。

**问题排查**

- commit提示无法识别作者，或命令运行在别的仓库。：先核对pwd和仓库根，再在contacts用git config user.name/user.email配置本人身份；不修改全局其他项目。
- 加了.gitignore却发现数据仍在git status。：忽略规则对已跟踪文件无效；先备份本地练习数据，再用git rm --cached -- 文件名移出跟踪并检查暂存diff，禁止误删源码。

**复盘问题**

- git diff与git diff --cached分别比较哪两个状态？
- 什么样的提交消息能让一个月后的自己知道这次变化的目的？

**参考资料**

- [缺失的一课：版本控制](https://missing-semester-cn.github.io/)
- [Git 官方入门](https://git-scm.com/docs/gittutorial)

**可选延伸（从已有预算中调配时间）**

- 非必做：用git show查看首个提交，从回看25分钟里调配5分钟，不练习危险的reset。

### w01-t08 · 本周复盘与主动休息（60 分钟）

操作：用 30 分钟回顾困难、记录实际投入和下周 3 个小目标，再安排 30 分钟离开屏幕散步或伸展。验收：留下 5 句复盘；未完成任务调整到下周，保持每周总预算 20 小时。

**学习目标：** 把第一周的实际能力、卡点与投入写成可验证记录，给第二周选三个目标，并完成30分钟离屏休息，保持每周1200分钟总预算。

**开始前确认**

- 有运行记录、语法练习、CLI源码和Git历史。
- 复盘允许诚实记录未完成项，不需要把所有框勾成完成。

**操作步骤**

1. **复盘与调整下周范围 · 30 分钟**

   - 前10分钟从新Ubuntu终端运行CLI，口述路径、模块、函数和内存数据流；每个说不清处记一个具体问题。
   - 中10分钟写至少5句：做成什么、证据在哪、最难错误、独立完成部分、下周三个目标；记录各任务实际分钟。
   - 后10分钟给遗留项排序，第二周优先持久化与测试；挪入遗留项时缩减原有任务范围，不把周20小时变成额外加班。
   - 复盘时把已会与看过分开：能不看资料写出的函数、必须借助提示才能完成的部分、尚未动手验证的结论分别注明；这能帮助下周把时间用在最真实的卡点上。

   ```text
   cd ~/projects/contacts
   go run .
   git log --oneline -5
   ```

2. **主动离屏休息 · 30 分钟**

   - 关闭终端与网页，离开屏幕散步或轻伸展30分钟；这段计入60分钟任务，不用手机刷教程补课。
   - 休息结束记录完成时长与下次学习开始时间；只记录安排，不在休息步骤继续调试程序。
   - 把散步或伸展视作本周计划的一部分，记录真实完成情况；若当天时间不足，减少可选练习，不用取消休息凑出表面完成率。

**完成后逐项验收**

- 有至少5句复盘及CLI/Git证据位置。
- 实际投入与遗留项明确，下周三个目标可执行。
- 完成30分钟复盘和30分钟离屏活动，调整后仍每周20小时。

**保留的学习产物**

- 第1周复盘记录与下周三目标。
- 实际时长表及休息记录。

**问题排查**

- 复盘只写学会了Go，没有可验证证据。：改写为能独立运行某函数、修复某条错误，并链接源码或记录具体命令输出。
- 遗留任务全部叠到下周，挤掉休息。：保留20小时预算与30分钟离屏段，先压缩低优先级延伸，明确延期而非隐性加任务。

**复盘问题**

- 不看资料时最不确定的是语法、路径还是数据流？
- 哪种记录帮助下一次定位错误，哪种只是在抄教材？

## 第 2 周：把通讯录保存成 JSON

目标：掌握结构体、方法、指针和文件读写，让联系人在程序重启后仍然存在。

### w02-t01 · 结构体、方法和指针（180 分钟）

操作：为 Contact 增加 ID，把新增、查询、删除封装为方法；对比值传递与指针传递。验收：用一段不超过 30 行的代码说明修改结构体为何需要指针，并完成通讯录重构。

**学习目标：** 为联系人增加稳定ID，明确结构体值复制、指针与方法接收者的区别，把新增、查询、删除收拢到可维护的内存存储结构。

**开始前确认**

- 第1周CLI能运行，错误输入已不会导致崩溃。
- 会切片、map与多返回值；ID在后续JSON保存中需要保持稳定。

**操作步骤**

1. **阅读方法与指针并画复制关系 · 20 分钟**

   - 阅读原中文资料的Structs、Methods、Pointers，只比较这三类，不提前研究接口大体系。
   - 画一个Contact值复制给函数的过程，再画指针指向同一对象；与C指针对照，Go不允许普通指针算术。
   - 约定整数ID由存储层产生，删除后不重用旧ID，姓名与电话仍为字符串。

   ```text
   cd ~/projects/contacts
   go doc builtin.new
   ```

2. **做不超过30行的独立实验 · 35 分钟**

   - 在exercises/pointers子目录自己写值参数修改与指针参数修改两函数；先预测调用后姓名是否改变。
   - 分别运行并打印修改前后值；指出&取得地址、*解引用，与Python对象引用的比较只解释可见行为。
   - 为修改Store的方法选择指针接收者，读取方法也保持一致，避免复制包含可变状态的对象。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/pointers
   go run ./exercises/pointers
   ```

3. **重构为内存Store方法 · 60 分钟**

   - 自己设计Store含联系人集合与下一个ID，把Add/Find/Delete签名写到纸上再迁移代码。
   - 新增分配稳定ID；删除按ID定位，不把切片下标直接当ID；查询返回结果加明确错误。
   - 让CLI仍负责读输入和打印，Store只管数据规则；每迁移一个方法就用已有输入样例回归。
   - 记录删除后新建的ID，应不同于旧联系人，重排列表时已有ID不变化。

   ```text
   cd ~/projects/contacts
   gofmt -w main.go
   go run .
   ```

4. **边界与复制故障排查 · 40 分钟**

   - 先新增3条，再删除中间ID并新增一条，确认未删ID稳定，查询被删ID失败。
   - 分别试空存储、未知ID、连续删除同一ID；失败必须不改变集合。
   - 对比返回Contact值与返回指针是否允许调用方直接修改内部对象，先选一种并写明契约。

   ```text
   cd ~/projects/contacts
   go run .
   go run ./exercises/pointers
   ```

5. **整理方法契约与回归记录 · 25 分钟**

   - 写三个方法的输入、返回值、失败条件和状态变化；用一张图说明CLI调用Store而非反过来。
   - 保留30行以内实验、ID序列与删除用例，脱离代码解释为什么指针接收者能修改Store。
   - 回归上一周未知命令、空输入和EOF；重构目标是职责清楚，不为模式名称继续拆分十层目录。

   ```text
   cd ~/projects/contacts
   go build -o contacts-demo .
   ```

**完成后逐项验收**

- 值/指针实验不超过30行，可解释两个输出不同的原因。
- 联系人拥有稳定ID，删除与再新增不使其他ID改变。
- Add/Find/Delete由Store方法完成，CLI输入输出仍工作。
- 未知ID与重复删除不破坏现有数据。

**保留的学习产物**

- 重构后的内存Store与CLI源码。
- 指针实验、方法契约和ID边界演示记录。

**问题排查**

- 方法执行后Store未变化，或ID总从1开始。：检查接收者是否被复制以及Store是否在每轮循环重新创建；有状态方法用指针并复用同一Store。
- 删除后查询错人，因为把索引作为ID。：为每条记录保存独立ID，按ID搜索；删除只改变集合位置，不改其他联系人ID。

**复盘问题**

- 返回结构体副本与内部指针会怎样影响调用方修改数据的能力？
- 稳定ID为什么比当前列表行号更适合持久化和HTTP接口？

**参考资料**

- [Go by Example：结构体、方法、指针](https://gobyexample-cn.github.io/)
- [Go by Example 中文：指针](https://gobyexample-cn.github.io/pointers)

**可选延伸（从已有预算中调配时间）**

- 非必做：比较指针接收者和值接收者的方法集合，从实验35分钟里调配10分钟。

### w02-t02 · 用 encoding/json 保存联系人（180 分钟）

操作：用标准库 encoding/json 编码和解码联系人；启动时读取 contacts.json，新增或删除后保存。验收：新建 3 条记录、退出并重启后仍能查询，JSON 文件可直接阅读。

**学习目标：** 以encoding/json和文件读写把内存状态持久化；启动加载，成功修改后保存，让联系人和ID在进程重启后保持一致。

**开始前确认**

- Store已包含ID与新增/查询/删除方法。
- 运行数据只保存在contacts的本地文件；.gitignore已经排除contacts.json。

**操作步骤**

1. **阅读JSON与定义持久化契约 · 20 分钟**

   - 阅读官方json文档的Marshal、MarshalIndent、Unmarshal及字段导出规则；原中文JSON文章作为解释辅助。
   - 定义保存格式：联系人数组以及必要的下一个ID，或加载后根据最大ID推导；在README说明选择。
   - 理解JSON的字符串、数字、对象、数组与Go类型的对应，不把JSON文件等同于数据库或Python对象序列化。

   ```text
   cd ~/projects/contacts
   go doc encoding/json.MarshalIndent
   go doc encoding/json.Unmarshal
   ```

2. **先做内存JSON往返 · 35 分钟**

   - 在exercises/json子目录创建3条虚构联系人，用导出字段和json标签编码，再解码进独立变量。
   - 比较ID、姓名、电话和值数量，不能只看输出文件长得像JSON；电话仍是字符串保留前导零。
   - 观察未导出字段不编码、nil切片与空切片的输出差异，选定空通讯录的表示并记下。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/json
   go run ./exercises/json
   ```

3. **接入加载与保存流程 · 60 分钟**

   - 自行实现Load和Save，先用os.ReadFile/os.WriteFile接通基本闭环；可靠替换在下一项专门改进。
   - 启动时加载一次，CLI新增或删除成功后保存；保存失败向用户提示，不能宣称已落盘。
   - 加载后恢复或计算下一ID，检查已有ID不会被复用；路径暂固定为项目下contacts.json并在文档说明。
   - 每一处错误都检查返回值，编码失败不能继续写空字节；读文件后解码到临时对象再确认可用。

   ```text
   cd ~/projects/contacts
   go doc os.ReadFile
   go doc os.WriteFile
   go run .
   ```

4. **重启与删除验证 · 40 分钟**

   - 新增3条，退出，用cat看JSON字段和值，再重启查询；与首次输入逐项对比。
   - 删除中间ID后退出重启，再新增一条，确认删除持久且新ID不重复。
   - 用含中文、引号和前导零电话的虚构数据测试转义；不要手动拼JSON字符串代替编码器。

   ```text
   cd ~/projects/contacts
   cat contacts.json
   go run .
   git status --short
   ```

5. **记录数据流与限制 · 25 分钟**

   - 画启动Load→Store→修改→Save→重启Load流程，标出文件读写错误出现的位置。
   - 写运行目录要求与演示命令；说明当前单进程CLI、保存还未具备可靠替换和损坏保护。
   - 核对git忽略规则生效，保留虚构演示结果但不提交实际运行数据文件。

   ```text
   cd ~/projects/contacts
   git check-ignore contacts.json
   go run ./exercises/json
   ```

**完成后逐项验收**

- 新增3条后重启仍可查询，姓名/电话/ID一致。
- 删除和再次新增经重启仍正确，ID不重复。
- 中文、引号、前导零电话有真实往返结果。
- JSON可读，所有编码、读写错误有检查，数据文件不进入Git。

**保留的学习产物**

- JSON加载保存代码与格式说明。
- 重启持久化、ID稳定和特殊字符的演示记录。

**问题排查**

- JSON是空对象或解码后字段为空。：检查字段是否导出，json标签是否正确；用短往返实验隔离编码问题，不能靠手写字符串补救。
- 换工作目录启动后似乎数据丢了。：相对文件路径基于进程工作目录；先pwd和查找文件，按README在contacts启动，后续可将数据路径配置化。

**复盘问题**

- 为什么保存成功和内存修改成功需要分别判断？
- 运行文件路径由源码所在目录还是进程当前目录决定？

**参考资料**

- [Go by Example：JSON 与文件](https://gobyexample-cn.github.io/)
- [Go 标准库 encoding/json](https://pkg.go.dev/encoding/json)

**可选延伸（从已有预算中调配时间）**

- 非必做：把数据路径改成CLI参数，从实现60分钟调配10分钟，可靠保存优先。

### w02-t03 · 让缺失、损坏文件可诊断（180 分钟）

操作：区分文件不存在、权限不足、JSON 损坏三类错误；为首次启动创建空数据，用临时文件保存后替换，损坏时保留原文件。验收：手动制造缺失与错误 JSON，终端提示对应原因，原数据没有被覆盖。

**学习目标：** 区分不存在、无权限、JSON损坏三类故障；用同目录临时文件写入再替换减少半写文件风险，损坏时保留原件并拒绝自动覆盖。

**开始前确认**

- JSON持久化闭环已跑通；所有故障演示使用独立测试目录。
- 只修改contacts代码与测试副本，不用真实联系人或TodoList/data做破坏性实验。

**操作步骤**

1. **列加载错误分支与阅读 · 20 分钟**

   - 阅读json.Unmarshal错误说明，并用go doc os.Rename、errors.Is了解错误链和替换条件。
   - 写三条契约：缺失表示首次启动空状态；权限错误返回可诊断错误；损坏不作为空状态继续覆盖。
   - 理解临时文件+rename不等于完整数据库事务；本项只针对本机同目录正常替换，不宣称断电一定无损。

   ```text
   cd ~/projects/contacts
   go doc os.Rename
   go doc errors.Is
   go doc os.ErrNotExist
   ```

2. **隔离样本与加载判定 · 35 分钟**

   - 在exercises/storage-cases建立缺失、损坏、权限三个子目录，每个都只放虚构副本。
   - 用errors.Is判断os.ErrNotExist，不通过字符串比较报错；缺失返回空Store，其余保留底层原因。
   - 先解码到临时状态，验证联系人ID和下一个ID再替换当前内存；失败不得留下半加载集合。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/storage-cases/missing exercises/storage-cases/broken exercises/storage-cases/denied
   go doc encoding/json.SyntaxError
   ```

3. **实现同目录临时文件保存 · 60 分钟**

   - 自己设计保存步骤：编码成功→同目录创建临时文件→完整写入→检查关闭错误→重命名目标。
   - 写失败时清理本次创建的临时文件，保留原目标；路径与权限选取有注释，不把数据写到系统临时盘后跨文件系统移动。
   - 若读到损坏JSON，CLI提示备份与人工修复并停止进入修改流程，不能随后退出时把空状态保存回去。
   - 重新跑新增、删除、重启闭环，观察正常保存后不遗留临时文件。

   ```text
   cd ~/projects/contacts
   go doc os.CreateTemp
   go doc os.File.Close
   go run .
   ```

4. **制造三种错误并验证不覆盖 · 40 分钟**

   - 缺失用一个全新的测试路径启动；损坏副本只写不完整JSON，先复制原始测试样本备份。
   - 权限副本先写虚构有效JSON再chmod 000，在普通用户下读取，测试后chmod 600恢复；不以sudo运行程序绕过问题。
   - 记录每种终端提示，比较损坏文件测试前后内容；临时保存失败不能把旧文件变成零字节。

   ```text
   cd ~/projects/contacts
   printf '{bad json\n' > exercises/storage-cases/broken/contacts.json
   chmod 000 exercises/storage-cases/denied/contacts.json
   chmod 600 exercises/storage-cases/denied/contacts.json
   ```

5. **总结恢复路径与可靠性边界 · 25 分钟**

   - 写故障表：现象、判断依据、是否可继续、人工恢复步骤；损坏数据先备份再修复，不盲目删文件。
   - 指出rename成功只表示本次替换完成，跨进程并发写与崩溃持久性仍未解决；这些留作限制。
   - 在正确数据路径回归CLI，保存恢复后的结果并把故障样本排除Git。

   ```text
   cd ~/projects/contacts
   go run .
   find exercises/storage-cases -type f
   ```

**完成后逐项验收**

- 缺失、权限不足、损坏分别有可辨认提示。
- 损坏文件不被空数据覆盖，加载失败不污染内存状态。
- 正常保存采用同目录临时文件再替换，失败保留旧文件。
- 权限演示后恢复权限，正常重启持久化仍通过。

**保留的学习产物**

- 错误分类与临时文件保存实现。
- 三类故障记录、原件对照和恢复步骤。

**问题排查**

- 把所有ReadFile错误都当首次启动，导致损坏或权限文件被覆盖。：只有errors.Is(err, os.ErrNotExist)进入空数据分支；其他错误终止加载并保留原件。
- chmod后仍能读取，或rename报跨设备错误。：用whoami确认不是root，只在普通用户样本测试；临时文件放目标文件同目录，避免跨挂载点重命名。

**复盘问题**

- 为什么加载到临时对象比直接解码进Store更容易保证失败不改状态？
- 临时文件替换解决了哪类风险，仍有哪些不能保证？

**参考资料**

- [李文周：文件操作与错误处理](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 标准库 encoding/json](https://pkg.go.dev/encoding/json)

**可选延伸（从已有预算中调配时间）**

- 非必做：研究Sync与断电持久性，从总结25分钟调整10分钟，仅记录边界，不承诺生产可靠性。

### w02-t04 · 为通讯录函数写第一批测试（180 分钟）

操作：学习 testing 与表驱动测试，为新增、查询、删除和 JSON 往返各写测试，使用 t.TempDir 隔离文件。验收：go test ./... 通过，至少一个测试先暴露你修复的边界错误。

**学习目标：** 学习testing与表驱动测试，用可重复断言覆盖通讯录业务和JSON往返；通过一次先失败后修复的测试验证真实边界。

**开始前确认**

- Store和文件加载保存可调用，已明确错误契约。
- 测试运行不读写根目录contacts.json，所有文件测试使用t.TempDir隔离。

**操作步骤**

1. **读最小测试规则并选择边界 · 20 分钟**

   - 阅读官方testing概览、Test函数、T.Run、T.TempDir相关段；暂不引入第三方测试框架。
   - 自己列Add、Find、Delete和JSON往返四组输入/预期，选择一个此前出现的真实错误作回归目标。
   - 理解测试不是打印结果看起来对：断言数量、值、错误和失败后状态；先明确被测行为再写测试。

   ```text
   cd ~/projects/contacts
   go doc testing.T.TempDir
   go doc testing.T.Run
   ```

2. **写业务函数测试 · 35 分钟**

   - 新建同包的store_test.go，函数以Test开头并接收*testing.T；先做一个成功Add/Find。
   - 写表驱动用例覆盖空姓名、未知ID、重复删除和删除后ID稳定；每个子测试使用新Store。
   - 错误路径验证error存在和集合未变化，不只比较整段错误文本；失败输出包含用例名和预期/实际。

   ```text
   cd ~/projects/contacts
   go test -run Test -v .
   ```

3. **文件隔离和JSON往返测试 · 60 分钟**

   - 用t.TempDir得到独立目录，再拼数据路径，测试保存→新Store加载→比对字段与ID。
   - 加首次缺失与损坏文件用例，验证损坏原文未被覆盖；不在测试中chmod项目目录。
   - 让案例使用虚构数据，JSON比较解码后的结构而非缩进/字段顺序；特殊字符和前导零也要覆盖。
   - 把需要从CLI调用的函数做最小可测试拆分，测试不启动交互输入、不靠sleep等待。

   ```text
   cd ~/projects/contacts
   go test -v ./...
   go doc testing.T.Fatalf
   ```

4. **让一个测试先失败再修复 · 40 分钟**

   - 选已发现的ID复用或损坏文件覆盖问题，保留测试的失败输出；如当前已修复，用历史错误案例验证测试确实能检测。
   - 围绕失败写一句根因，再修最小代码；不要修改预期让错误答案通过。
   - 复跑单个测试和全量测试，理解一次通过只是覆盖的场景通过，不等于所有程序正确。

   ```text
   cd ~/projects/contacts
   go test -run TestDelete -v .
   go test ./...
   ```

5. **整理测试地图与提交 · 25 分钟**

   - 写四个功能对应哪些Test，哪些仍是人工验收，如终端EOF和权限实际环境。
   - 格式化测试与源码，读diff确认没混入运行JSON，把失败→修复→通过证据留在笔记。
   - 记录Ubuntu/Go版本与命令，使下一次能重跑相同测试；不追求覆盖率数字代替边界质量。

   ```text
   cd ~/projects/contacts
   gofmt -w store_test.go
   go test ./...
   git diff
   ```

**完成后逐项验收**

- go test ./...通过，业务和JSON往返都有断言。
- 至少一条边界测试有先失败、定位、修复、通过证据。
- 文件测试只使用t.TempDir，不改真实运行数据。
- 子测试独立，可用名字单独运行，不依赖执行顺序。

**保留的学习产物**

- store_test.go及文件往返/错误测试。
- 测试地图与一条真实缺陷回归记录。

**问题排查**

- go test说没有测试文件，或测试一直等待输入。：检查文件名以_test.go结尾、函数签名正确；测试直接调用业务函数，不调用需要stdin的main。
- 测试单独通过，整体运行却互相影响或修改contacts.json。：每个子测试创建独立Store和t.TempDir，数据路径显式传入；移除全局共享状态与工作目录依赖。

**复盘问题**

- 哪条断言能证明失败新增没有偷偷改变数据？
- 如果测试失败，你如何区分测试预期错误和实现错误？

**参考资料**

- [李文周：Go 单元测试](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 标准库 testing](https://pkg.go.dev/testing)

**可选延伸（从已有预算中调配时间）**

- 非必做：查看go test -cover，仅从总结25分钟调配5分钟，解释数字不代表完整正确性。

### w02-t05 · Linux 权限、重定向与管道（150 分钟）

操作：练习 chmod、ls -l、>、>>、|、wc，在练习目录改变文件权限并观察 Go 读写错误。验收：能解释 rwx 和 owner/group/other，将通讯录输出重定向到文件并统计行数。

**学习目标：** 理解owner/group/other的rwx权限、标准输出与错误输出、重定向和管道；在练习文件上观察Go读取权限错误并恢复。

**开始前确认**

- 会pwd、cat、cp与man；以caolingyun普通用户进行练习。
- 仅操作contacts/exercises/permissions，不改TodoList或整个家目录权限。

**操作步骤**

1. **读权限与标准流 · 20 分钟**

   - 用man阅读chmod符号/数字模式，画owner/group/other与rwx九位；区分文件读取和目录访问的含义。
   - 理解stdout/stderr以及>覆盖、>>追加、|传递stdout；先写预测再运行。
   - 检查whoami，不能用root演示权限拒绝；每次改变前记录原权限便于恢复。

   ```text
   cd ~/projects/contacts
   whoami
   man chmod
   ls -l main.go
   ```

2. **创建样本并改变权限 · 30 分钟**

   - 在练习目录写虚构文本并查看ls -l，记录默认权限，不假设所有机器相同。
   - 用chmod 600把读取限定给所有者，再用chmod 000禁止读取；尝试cat并观察Permission denied。
   - 恢复600后再次读取；不使用chmod -R或777来修未知故障。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/permissions
   printf 'sample contact\n' > exercises/permissions/sample.txt
   ls -l exercises/permissions/sample.txt
   chmod 000 exercises/permissions/sample.txt
   cat exercises/permissions/sample.txt
   chmod 600 exercises/permissions/sample.txt
   ```

3. **重定向CLI与管道统计 · 45 分钟**

   - 利用上一周input-cases.txt驱动CLI，把stdout保存练习output.txt，stderr独立保存errors.txt；先确认目标不是源码。
   - 再次运行用>>追加，对比wc -l前后；解释>会截断目标，不能把输出重定向到main.go。
   - 把保存文本通过cat接wc -l，注意行数不等于联系人数量，因为提示语也占行。
   - 按Go输入契约确认重定向后EOF会退出；若不停打印，应先修Scan结束条件，不用kill掩盖。

   ```text
   cd ~/projects/contacts
   go run . < input-cases.txt > exercises/permissions/output.txt 2> exercises/permissions/errors.txt
   wc -l exercises/permissions/output.txt
   cat exercises/permissions/output.txt | wc -l
   ```

4. **把权限错误连到Go程序 · 35 分钟**

   - 让文件练习或独立小程序读取sample.txt，先成功再设000观察Go返回的错误链，读完恢复600。
   - 比较cat与Go错误是否指向同一文件和权限，区分源代码编译成功与运行读文件失败。
   - 检查目录访问权限概念，但只解释不改项目目录；以日志和ls -l定位，不随意sudo运行。

   ```text
   cd ~/projects/contacts
   chmod 000 exercises/permissions/sample.txt
   ls -l exercises/permissions/sample.txt
   chmod 600 exercises/permissions/sample.txt
   ```

5. **汇总命令与恢复核对 · 20 分钟**

   - 做权限/标准流卡，给rwx、600、>、>>、2>、|各留一个观察结果。
   - 用ls -l确认所有样本权限恢复；运行CLI与go test确认没有误改数据路径或源码。
   - 把可重复命令写进练习说明，标明目录；不提交可能含个人信息的输出日志。

   ```text
   cd ~/projects/contacts
   ls -l exercises/permissions
   go test ./...
   ```

**完成后逐项验收**

- 能解释owner/group/other及600、000，样本权限已恢复。
- 普通用户下cat与Go均观察到权限拒绝。
- stdout/stderr可分别保存，知道>与>>区别。
- 管道统计结果可解释，未把行数当作联系人数量。

**保留的学习产物**

- 权限样本、重定向输出与练习说明。
- 权限/标准流卡和Go读权限失败记录。

**问题排查**

- chmod 000后程序仍读取成功。：确认不是root、不是内存缓存或旧文件路径；用whoami/ls -l和实际数据路径核对。
- 重定向后文件内容突然没了，或错误没被管道统计。：先检查是否用>覆盖了目标；stdout和stderr不同，2>单独保存错误，测试始终在样本路径操作。

**复盘问题**

- 程序可以编译却读不了文件，说明故障发生在哪个阶段？
- 为什么把stderr单独保存有助于解释CLI输出统计？

**参考资料**

- [缺失的一课：Shell 工具与脚本](https://missing-semester-cn.github.io/)
- [缺失的一课中文：Shell工具与脚本](https://missing-semester-cn.github.io/2020/shell-tools/)

**可选延伸（从已有预算中调配时间）**

- 非必做：观察目录x权限作用，从排查35分钟调配10分钟，只对新建空样本目录操作并恢复。

### w02-t06 · 哈希表与字符串题（150 分钟）

操作：用 Go map 写字符计数和两数之和，分别覆盖空输入、重复元素和不存在答案。验收：两道题独立完成，能解释时间和空间复杂度，记录自己最初的错误。

**学习目标：** 用Go map完成字符频次与两数之和，明确Unicode字符、下标与时间/空间复杂度；用重复值和不存在答案检验算法契约。

**开始前确认**

- 会map、range、切片，已有基础测试经验。
- 算法放contacts/exercises/hash，姓名仍使用虚构值。

**操作步骤**

1. **定字符与返回值契约 · 20 分钟**

   - 阅读原中文资料Map与字符串段；用go doc rune了解字符类型，不把字节长度与字符数混为一谈。
   - 字符计数按Unicode码点rune定义，组合字形不在本题范围；两数之和返回两个不同下标和是否存在。
   - 先写空串、中文、重复字符，以及空数组、重复数字、无解的预期。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/hash
   go doc rune
   ```

2. **字符计数独立实现 · 30 分钟**

   - 用range遍历字符串并在map[rune]int累加，比较len(s)字节数与遍历次数。
   - 测试'aab'、空串和'你好你'，按键值对核对，不依赖map遍历顺序。
   - 说明O(n)扫描与O(k)额外空间，k为不同码点数；不引入中文分词问题。

   ```text
   cd ~/projects/contacts
   go run ./exercises/hash
   ```

3. **两数之和先想再写 · 45 分钟**

   - 先写暴力双循环思路估算O(n²)，再画哈希保存已见数字的过程。
   - 自行实现单遍map：先查补数，再登记当前值，避免同一个元素被使用两次。
   - 用[3,3]目标6和[3]目标6说明不同下标要求；多答案允许任意一组，验证值与下标合法性。
   - 解释预期O(n)与O(n)空间，不承诺哈希任何输入都严格最坏O(1)。

   ```text
   cd ~/projects/contacts
   gofmt -w exercises/hash/main.go
   go run ./exercises/hash
   ```

4. **边界测试与失败分析 · 35 分钟**

   - 为两题写表驱动测试，覆盖空输入、重复、无解、负数和中文计数，错误输出包含输入。
   - 故意把先查后写倒置，看看单元素场景是否被错误命中，再恢复正确顺序。
   - 如map复用导致跨用例污染，每个函数调用创建独立表；记录一条真实调试路径。

   ```text
   cd ~/projects/contacts
   go test -v ./exercises/hash
   ```

5. **保存思路与口述复杂度 · 20 分钟**

   - 不用代码口述两数之和扫描[2,7,11,15]的map变化，指出何时找到补数。
   - 给每题写输入契约、核心不变量、边界、复杂度和最初错误，保留测试命令。
   - 比较本周map计数与第一周姓名计数的共同结构，说明键类型由需求决定。

   ```text
   cd ~/projects/contacts
   go test ./exercises/hash
   ```

**完成后逐项验收**

- 两题独立完成，中文计数按rune而非字节。
- 两数之和返回不同且合法下标，无解有明确标志。
- 空输入、重复元素、不存在答案都有通过测试。
- 能解释扫描不变量、预期时间与空间复杂度。

**保留的学习产物**

- exercises/hash的两个函数和表驱动测试。
- map手画过程、复杂度与错题笔记。

**问题排查**

- 中文计数得到奇怪符号或数量多于预期。：不要按s[i]逐字节当字符；range得到rune，明确本题按码点而非视觉字形计数。
- 单个3就被当成目标6的两数答案。：查补数发生在登记当前元素之前，并在测试里断言两个索引不同。

**复盘问题**

- 先登记再查补数为什么可能使用同一元素两次？
- 字符串长度、码点数与用户看到的字形数一定相同吗？

**参考资料**

- [Go by Example：Map 与字符串](https://gobyexample-cn.github.io/)
- [Go by Example 中文：Map](https://gobyexample-cn.github.io/maps)
- [Go 标准库 testing](https://pkg.go.dev/testing)

**可选延伸（从已有预算中调配时间）**

- 非必做：实现暴力版与哈希版对照测试，从边界35分钟调配10分钟。

### w02-t07 · 学习分支、合并和 GitHub 推送（120 分钟）

操作：在 feature/json 分支完成一处小修改，合并回主分支；创建自己的 GitHub 仓库并按网页提示配置远程与推送。验收：网页能看到源码、README 和提交记录，从新目录 clone 后能运行。

**学习目标：** 在独立contacts仓库练习分支、合并、远程与推送，并用新目录clone验证交付；远程公开范围由自己选择，秘密和运行数据不得提交。

**开始前确认**

- contacts已有两次以上提交、.gitignore和可运行README。
- 需要本人GitHub账号；认证在本人界面完成，不把令牌写进源码、日志或聊天。

**操作步骤**

1. **理解分支与查当前状态 · 20 分钟**

   - 阅读Git官方tutorial的分支/合并/共享段；区分本地分支、远程地址、推送与clone。
   - git status确认干净，记录当前主分支名，后续切回实际名字而非盲目假定main。
   - 列此次小变更，如完善JSON启动说明；若已有未提交作业先完成有意义提交，再创建分支。

   ```text
   cd ~/projects/contacts
   git status
   git branch --show-current
   git remote -v
   ```

2. **在feature/json修改并合并 · 35 分钟**

   - 创建feature/json，做一个可验证小改动，运行测试、查看diff、提交；不为练习覆盖之前源码。
   - 切回记录的主分支，再merge feature/json；若冲突，读双方内容后自行选择保留语义，运行测试再提交。
   - 用log --graph解释分支合流，区分快进与实际合并提交，不强造冲突或复杂rebase。

   ```text
   cd ~/projects/contacts
   git switch -c feature/json
   git diff
   go test ./...
   git log --oneline --graph --all
   ```

3. **创建远程并按网页提示推送 · 40 分钟**

   - 本人在GitHub创建contacts学习仓库，选择私有或确认仅虚构数据再公开；已有本地README时远端先不初始化README。
   - 按本人仓库网页提供的实际HTTPS/SSH地址配置origin；若origin已存在先核对，不重复add或指向TodoList。
   - 依提示完成认证，令牌不要出现在URL、commit或终端记录；首次push选择当前实际主分支并建立跟踪。
   - 网页检查源码、README、提交历史；git ls-files确认contacts.json、二进制和本地配置不在跟踪集合。

   ```text
   cd ~/projects/contacts
   git ls-files
   git remote -v
   git branch --show-current
   ```

4. **从新目录复现并记录 · 25 分钟**

   - 在~/projects/contacts-repro这样独立且不存在的新目录clone实际仓库；不能覆盖原contacts。
   - 按README启动并go test ./...，运行文件应从首次空状态生成，不能依赖原目录的JSON。
   - 网络或账号暂不可用时记录准确阻碍及本地分支/测试证据，明确远程验收未完成，不跳过要求宣称完成。

   ```text
   cd ~/projects
   git clone <本人实际仓库URL> contacts-repro
   cd ~/projects/contacts-repro
   go test ./...
   go run .
   ```

**完成后逐项验收**

- feature/json有提交且合并回实际主分支，测试通过。
- 本人远程仓库页面可见源码、README与历史。
- 独立clone目录按README能运行和测试。
- 运行JSON、二进制、真实联系方式与凭据未入库。

**保留的学习产物**

- 分支合并历史与本人仓库地址。
- 新clone复现记录和远程认证问题记录（如有）。

**问题排查**

- push报remote origin already exists或非快进拒绝。：先git remote -v和log核对仓库；不要force推送，理解远端已有提交后按实际情况fetch并合并。
- clone后运行失败，原目录却正常。：核对README目录、go.mod、未提交源码和配置依赖；补齐可公开配置示例，不上传自己的凭据或运行数据。

**复盘问题**

- commit、push与clone分别改变哪里的状态？
- 新clone验收暴露了哪些原目录中的隐含依赖？

**参考资料**

- [缺失的一课：版本控制](https://missing-semester-cn.github.io/)
- [Git 官方 tutorial](https://git-scm.com/docs/gittutorial)

**可选延伸（从已有预算中调配时间）**

- 非必做：阅读git log --graph图，从复现25分钟调配5分钟，网络推送验收优先。

### w02-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟复盘文件保存、测试和 Git，列出 2 个尚未理解的点；30 分钟离开屏幕活动。验收：记录本周实际时长和一个下周需要验证的问题。

**学习目标：** 检查持久化、错误保护、测试与Git交付的真实完成度，留两处理解缺口和一条下周要验证的问题，再离屏休息30分钟。

**开始前确认**

- 有JSON重启、故障演示、测试和分支记录。
- 每周总预算仍1200分钟，延伸和遗留工作需要替换现有范围。

**操作步骤**

1. **用证据复盘并安排下周 · 30 分钟**

   - 前10分钟从磁盘加载讲到Store修改与安全保存，指出三种错误分支；随机运行一个测试并解释断言证明什么。
   - 中10分钟核对实际分钟与Git交付，写两个尚未理解的点，如指针副本或临时文件边界；记录证据路径和真实未完成项。
   - 后10分钟选一条HTTP前要验证的问题，调整遗留任务的优先级；不能把下周接口工作与所有延伸同时叠加。
   - 对照第一周内存版，写出现在新增的能力和还保留的限制：只能本机单进程运行、运行目录要求、错误后需要人工恢复的情况；每条都对应实验，不凭感觉把程序评价为稳定或高性能。

   ```text
   cd ~/projects/contacts
   go test ./...
   git log --oneline -5
   ```

2. **离屏活动与学习间隔 · 30 分钟**

   - 关闭源码、终端和资料，散步或伸展30分钟，不用手机继续看教程；记录休息开始与结束时间。
   - 结束后只写下次学习窗口和身体/注意力变化，不在此段重启调试；保留恢复精力的时间。

**完成后逐项验收**

- 留下两个具体理解缺口与一条下周验证问题。
- 持久化、错误保护、测试和Git各有证据位置或未完成标记。
- 实际分钟与范围调整明确，完成30分钟离屏活动。

**保留的学习产物**

- 第2周复盘与HTTP前验证问题。
- 实际时长表、遗留项优先级和休息记录。

**问题排查**

- 只因测试绿了就把损坏/权限保护全标完成。：分别核对自动测试覆盖与普通用户人工故障记录，未验证项如实保留。
- 网络推送卡住，整周其他任务都被视作失败。：区分本地代码/分支验收与远程未完成项，记录错误和下一步，在原预算内安排后续处理。

**复盘问题**

- 哪条测试最有价值，因为它曾经发现真实错误？
- 自己的理解缺口是概念不清，还是缺少一个能证伪猜想的实验？

## 第 3 周：给通讯录提供 HTTP API

目标：理解浏览器到 Go 服务的请求流程，使用 net/http 提供联系人增删查接口。

### w03-t01 · 用 net/http 启动本机服务（180 分钟）

操作：建立 /health 与 GET /contacts，绑定 127.0.0.1:8080，返回 JSON 和正确 Content-Type。验收：浏览器与 curl 都能获取联系人，能说明监听地址、端口和处理函数各做什么。

**学习目标：** 用标准库net/http把现有通讯录暴露为本机HTTP服务，先完成健康检查和只读列表，理解监听地址、端口、请求处理函数与JSON响应。

**开始前确认**

- JSON版Store与业务测试已通过。
- 命令在Ubuntu终端执行，curl已安装；服务只监听127.0.0.1:8080。

**操作步骤**

1. **阅读最小HTTP服务契约 · 20 分钟**

   - 阅读http官方文档的HandleFunc、ListenAndServe和ResponseWriter，原中文HTTP例子用于对照。
   - 写/health和GET /contacts的预期状态、Content-Type与响应体；健康检查只证明服务响应，不承诺数据库健康。
   - 画客户端→回环地址8080→ServeMux→handler→Store，理解浏览器也是HTTP客户端。

   ```text
   cd ~/projects/contacts
   go doc net/http.HandleFunc
   go doc net/http.ListenAndServe
   ```

2. **准备serve模式与健康检查 · 35 分钟**

   - 在现有入口加serve模式，保留CLI模式，避免新建第二个根目录main函数；按项目结构自行放handler文件。
   - 先只注册/health，设置application/json再写状态与响应；用标准编码器，不手拼JSON。
   - 监听127.0.0.1:8080并检查启动error，前台运行用Ctrl+C停止；不绑定0.0.0.0。

   ```text
   cd ~/projects/contacts
   go run . serve
   ```

3. **连接只读列表与JSON · 60 分钟**

   - 为GET /contacts调用已有Store列表，编码Contact数组，空列表约定返回[]；不把文件路径或内部错误返回客户端。
   - 使用独立ServeMux，按官方方法/路径规则注册GET /contacts；当前Go支持方法路由，检查本机go doc再使用。
   - 返回响应前设置Content-Type；如果已有写出才设置头，修正顺序并重新观察curl。
   - 启动时仍按第二周安全规则加载文件，损坏文件必须报错而非静默变成空通讯录。

   ```text
   cd ~/projects/contacts
   go doc net/http.ServeMux
   go doc net/http.ResponseWriter
   go run . serve
   ```

4. **两终端与浏览器验收 · 40 分钟**

   - A终端前台跑服务，B终端curl -i查看状态、头和JSON；B不用进入源目录也能发网络请求，但记录目录方便保存日志。
   - 浏览器打开同一URL，比较同样的列表内容；Windows浏览器访问失败先以Ubuntu curl结果定位，不修改监听到公网。
   - 用空列表和3条虚构数据测试，停服后curl观察连接拒绝，重新启动确认数据仍从文件加载。

   ```text
   cd ~/projects/contacts
   curl -i http://127.0.0.1:8080/health
   curl -i http://127.0.0.1:8080/contacts
   ```

5. **写启动与响应说明 · 25 分钟**

   - 记录serve模式命令、两个URL、状态/头/体示例和停止方式；明确服务目前仅提供只读接口。
   - 解释浏览器GET、监听端口、处理函数分别做什么，能指出终端阻塞是服务在等待请求。
   - 回归CLI与业务测试，确保新增HTTP入口没有破坏上一周路径和JSON保护。

   ```text
   cd ~/projects/contacts
   go test ./...
   go run .
   ```

**完成后逐项验收**

- 服务监听127.0.0.1:8080，/health可响应。
- GET /contacts状态200且Content-Type为application/json。
- Ubuntu curl与浏览器能读取相同联系人，空数组契约明确。
- CLI和旧测试继续运行，启动错误被记录并处理。

**保留的学习产物**

- serve模式、两个只读handler和启动说明。
- curl/浏览器响应记录及请求流程图。

**问题排查**

- 终端运行后没有返回提示符，以为程序卡死。：服务前台等待请求是预期；开第二个Ubuntu终端curl，结束时回A终端Ctrl+C。
- 返回JSON却显示text/plain，或端口绑定失败。：设置头必须在首次写响应前；看ListenAndServe错误，端口占用在Linux任务中用ss定位，不重复安装Go。

**复盘问题**

- URL里的地址、端口与路径分别交给哪个部分处理？
- 为什么go run . serve可以持续运行，而之前CLI退出就停止？

**参考资料**

- [Go by Example：HTTP 服务](https://gobyexample-cn.github.io/)
- [Go net/http：Handler、ServeMux与Server](https://pkg.go.dev/net/http)

**可选延伸（从已有预算中调配时间）**

- 非必做：加一个只读单联系人GET，从实现60分钟调整15分钟，只在两条必做接口通过后尝试。

### w03-t02 · 实现新增、删除与状态码（180 分钟）

操作：实现 POST /contacts 与 DELETE /contacts/{id}，限制请求体大小，校验输入并返回 400、404、405 等状态。验收：用 curl 执行成功和失败请求，记录至少 6 组请求、响应和状态码。

**学习目标：** 添加POST新增与DELETE删除，明确JSON输入、请求体大小、ID校验与HTTP状态码，让客户端能分辨成功、输入错误、资源不存在和方法不支持。

**开始前确认**

- /health与GET /contacts已运行，已有Store新增和删除方法。
- 所有curl示例数据为虚构，服务继续仅监听回环地址。

**操作步骤**

1. **写接口与错误契约 · 20 分钟**

   - 阅读http官方Request、MaxBytesReader、状态常量与路径参数部分，先写接口表再实现。
   - 约定POST成功201并返回新ID，DELETE成功204且无响应体；非法JSON/字段400、未知ID404、错误方法405。
   - 选请求体上限如4KiB，大于上限返回413；超限判断与普通JSON语法错误应分开。

   ```text
   cd ~/projects/contacts
   go doc net/http.MaxBytesReader
   go doc net/http.Request.PathValue
   ```

2. **实现POST解析与校验 · 35 分钟**

   - 用标准JSON解码器读取受限Body，校验姓名电话，忽略或拒绝未知字段按文档明确，不接受请求方指定ID。
   - 只接受一个JSON对象，解码后检查多余内容；空Body、无效JSON与尾随垃圾不可当成功。
   - 调用Store成功且保存成功后返回201；存储失败返回500并留日志，不把原始文件错误泄露到客户端。

   ```text
   cd ~/projects/contacts
   go run . serve
   ```

3. **实现DELETE与方法路由 · 60 分钟**

   - 用DELETE /contacts/{id}取路径参数，解析正整数；无效ID返回400，不存在联系人返回404。
   - 调用删除后保存，成功204不写JSON体；写状态和写响应只能一个出口，避免重复发送。
   - 为相同资源的错误方法返回405并提供允许方法说明；若使用ServeMux方法路由，观察其自动响应并写入契约。
   - 把错误结构统一为简短message，handler保留请求层职责，业务检查仍复用Store。

   ```text
   cd ~/projects/contacts
   go doc net/http.ServeMux
   go test ./...
   ```

4. **六组成功失败请求 · 40 分钟**

   - 执行合法POST、合法DELETE、空姓名、非法JSON、未知ID和错误方法六组curl，记录原请求/状态/体。
   - 另外用自己生成的大请求文件验证413，包含尾随JSON的请求验证400；不依赖jq解析，直接观察curl -i。
   - 失败后GET核对集合未改变，重启验证合法新增/删除仍持久；测试命令的实际ID用POST返回值替换。

   ```text
   cd ~/projects/contacts
   curl -i -X POST http://127.0.0.1:8080/contacts -H 'Content-Type: application/json' -d '{"name":"demo-a","phone":"01012345"}'
   curl -i -X POST http://127.0.0.1:8080/contacts -H 'Content-Type: application/json' -d '{bad}'
   curl -i -X DELETE http://127.0.0.1:8080/contacts/999999
   curl -i -X PUT http://127.0.0.1:8080/contacts
   ```

5. **整理契约与回归 · 25 分钟**

   - 把6组请求响应写入API说明，注明大小上限、JSON规则、状态码和ID来源。
   - 对照控制台日志解释一次500与400的区别；未发生500可在独立测试副本模拟保存失败。
   - 回归原GET、health与CLI，新增接口不改变联系人字段格式。

   ```text
   cd ~/projects/contacts
   go test ./...
   git diff
   ```

**完成后逐项验收**

- POST新增返回201和ID，DELETE成功204且无响应体。
- 400/404/405对应错误可观察，超限请求返回413。
- 至少6组请求/响应/状态记录完整，失败不产生联系人。
- 合法修改经重启仍持久，原只读接口正常。

**保留的学习产物**

- 新增/删除handler与状态码契约。
- 六组curl记录、超限样本和错误响应说明。

**问题排查**

- DELETE返回204却又写JSON，或客户端看到200代替预期状态。：WriteHeader只在写体前决定状态；204不写体，集中响应出口，避免先打印内容后设置状态。
- 大请求只得到400，或两个连续JSON被接受。：识别MaxBytesReader的超限错误并映射413；首次Decode后确认EOF，没有额外JSON或垃圾。

**复盘问题**

- 资源不存在404与请求字段非法400的判断边界是什么？
- 为什么状态码和JSON错误信息都需要明确，而不是所有请求返回200？

**参考资料**

- [李文周：HTTP 与 Web 开发](https://liwenzhou.com/posts/go/golang-menu/)
- [Go net/http：Handler、ServeMux与Server](https://pkg.go.dev/net/http)

**可选延伸（从已有预算中调配时间）**

- 非必做：补Location头，从契约整理25分钟调整5分钟，错误和超限验收优先。

### w03-t03 · 保护共享状态并测试 API（180 分钟）

操作：把联系人操作放在加锁的存储层，使用 httptest 覆盖 API；运行 go test -race ./...。验收：两次并发新增不会丢记录，测试中覆盖非法 JSON 和未知 ID，竞态检测通过。

**学习目标：** 理解HTTP handler可并发执行，把共享联系人与文件保存置于一致的同步边界，并用httptest和竞态检测验证API，而不是只靠手动curl。

**开始前确认**

- HTTP增删查已可用，业务测试存在。
- 本机gcc已安装，可支持Linux竞态测试；数据仍为单进程JSON存储。

**操作步骤**

1. **理解共享读写与选择锁范围 · 20 分钟**

   - 阅读http的并发服务说明、httptest.NewRequest/NewRecorder，再用go doc sync.Mutex查Lock/Unlock。
   - 画两个POST同时读取nextID、append、保存的交错，说明竞态、丢记录与文件覆盖不是完全相同的问题。
   - 选择Store内部锁，所有列表/查询/修改与关联保存遵守同一边界；不在handler各自创建不同锁。

   ```text
   cd ~/projects/contacts
   go doc sync.Mutex
   go doc net/http/httptest.NewRecorder
   ```

2. **最小同步与快照复制 · 35 分钟**

   - 给Store增加锁，锁住ID分配、集合修改与保存相关步骤；别复制含Mutex的Store。
   - 列表返回副本以防调用方在解锁后修改共享底层切片；指出只保护写而不保护读仍可能竞态。
   - 如某方法内部已加锁，不在持锁状态调用它再次Lock；明确内部无锁辅助函数或调整调用层。

   ```text
   cd ~/projects/contacts
   go test ./...
   ```

3. **用httptest验证请求响应 · 60 分钟**

   - 自己构造handler测试，NewRequest创建请求、NewRecorder接响应，不必启动真实8080端口。
   - 覆盖成功POST/GET/DELETE、非法JSON、未知ID和错误方法；断言状态、Content-Type与关键字段。
   - 每个测试使用新Store及t.TempDir；不能依赖前一个测试留下ID或文件。
   - 写并发新增测试，等待两个goroutine完成后验证记录数与ID唯一，并读回JSON核对持久化结果。

   ```text
   cd ~/projects/contacts
   go doc net/http/httptest.NewRequest
   go test -v ./...
   ```

4. **运行竞态与真实回归 · 40 分钟**

   - 执行go test -race ./...，保留实际输出；如有报告，从读/写栈定位共享字段，不简单加sleep。
   - 竞态检查通过后重新启动服务，在两个终端发送新增，确认数量和ID，随后重启看文件一致。
   - 理解-race只检测实际执行路径，测试需主动覆盖并发；对未测跨进程写保持限制。

   ```text
   cd ~/projects/contacts
   go test -race ./...
   go run . serve
   ```

5. **记录并发边界 · 25 分钟**

   - 写锁保护字段、获得/释放位置、返回副本的理由；标记单进程保证和多进程风险。
   - 把一个竞态或死锁现象、根因、修复、回归证据留下；若未出现竞态也说明测试设计覆盖了哪些交错。
   - 回归业务与文件故障测试，确认加锁没有吞掉保存错误或损坏原件保护。

   ```text
   cd ~/projects/contacts
   go test ./...
   go test -race ./...
   ```

**完成后逐项验收**

- 读写和ID分配共享正确同步边界，列表不暴露可修改内部切片。
- httptest覆盖成功路径、非法JSON、未知ID与方法错误。
- 两次并发新增不丢数据、ID唯一，JSON读回一致。
- go test -race ./...通过，并记录检测范围限制。

**保留的学习产物**

- 同步后的Store、API测试与并发新增测试。
- 竞态检测结果及锁边界说明。

**问题排查**

- 加锁后请求一直不返回。：检查持锁方法是否再次调用同锁方法，避免嵌套Lock；用调用图确认锁只在一个层面获取。
- race通过但重启后少记录。：竞态检测不证明业务原子性；检查修改与保存是否被同一同步边界保护，并用文件读回断言验证。

**复盘问题**

- 保护切片写入但在锁外编码同一底层切片，为什么仍有风险？
- 竞态检测通过能证明所有并发情况下都正确吗？

**参考资料**

- [李文周：并发与单元测试](https://liwenzhou.com/posts/go/golang-menu/)
- [Go net/http：Handler、ServeMux与Server](https://pkg.go.dev/net/http)
- [Go httptest：请求与响应记录器](https://pkg.go.dev/net/http/httptest)

**可选延伸（从已有预算中调配时间）**

- 非必做：比较Mutex与RWMutex，从阅读20分钟调整5分钟；先用简单Mutex完成正确性。

### w03-t04 · 串起 HTTP、TCP 与请求日志（180 分钟）

操作：画出客户端、TCP 连接、HTTP 请求、Go handler、JSON 文件的流程；给服务记录方法、路径、状态和耗时。验收：能口述 GET 与 POST、请求头与请求体、HTTP 与 TCP 的关系，并用一条日志定位一次请求。

**学习目标：** 把客户端、TCP、HTTP、handler、Store与JSON文件串成可解释的请求流程；用方法、路径、状态和耗时日志定位一次失败请求。

**开始前确认**

- 本机HTTP CRUD与API测试已通过。
- 知道curl -i可显示响应头，本项不要求抓包、TLS或复杂网络工具。

**操作步骤**

1. **阅读协议与日志范围 · 20 分钟**

   - 阅读http官方Request/Response说明，分清请求头、请求体、响应状态与响应体。
   - 选一条POST手画客户端建连接、HTTP传输、路由、校验、Store和文件保存流程。
   - TCP提供字节流，HTTP规定请求响应语义；同一连接可能复用，不能把每个请求画成必然新建连接。

   ```text
   cd ~/projects/contacts
   go doc net/http.Request
   go doc net/http.Response
   ```

2. **用curl观察请求与响应 · 35 分钟**

   - 在A终端跑服务，B终端curl -v看请求方法、Host、Content-Type、状态与返回内容。
   - 比较GET没有本项业务请求体、POST传JSON、DELETE由路径定位资源；不把GET可带体等协议边界当本阶段重点。
   - 在图上分别标注TCP层与HTTP层，并指出文件写入发生在handler之后的存储层。

   ```text
   cd ~/projects/contacts
   curl -v http://127.0.0.1:8080/contacts
   curl -v -X POST http://127.0.0.1:8080/contacts -H 'Content-Type: application/json' -d '{"name":"log-demo","phone":"00001"}'
   ```

3. **添加可定位的请求日志 · 60 分钟**

   - 设计简单包装handler记录开始时间和结束耗时，字段至少method、path、status、duration。
   - 若包装ResponseWriter，记录第一次WriteHeader和未显式写状态时的默认200；不能凭method猜返回码。
   - 给成功、400、404各发一次请求，把日志与curl对应；健康检查也能留简单记录。
   - 只记录必要请求元信息，不把电话、完整请求体或后续数据库DSN写入日志；本项不引入大型日志框架。

   ```text
   cd ~/projects/contacts
   go doc time.Now
   go doc log.Printf
   go test ./...
   ```

4. **用失败请求验证日志真实性 · 40 分钟**

   - 发送非法JSON和未知ID，核对日志状态与响应一致；若某状态全是200检查WriteHeader包装。
   - 将stdout/stderr重定向到练习日志，在另一个终端tail查最后几条，再用grep按路径筛选。
   - 请求数量少时用人工时间顺序匹配，记录这种方法的限制；请求ID留后续项目再正式引入。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/http-logs
   go run . serve > exercises/http-logs/server.log 2>&1
   tail -n 20 exercises/http-logs/server.log
   grep '/contacts' exercises/http-logs/server.log
   ```

5. **口述一次完整请求 · 25 分钟**

   - 不看代码从curl发出到JSON落盘连续讲3分钟，指出发生400时哪些步骤不会执行。
   - 保存一条失败日志及相应请求、根因和修复建议，流程图同时标注回包方向。
   - 解释日志耗时是本机本次测量，不能据此声称高并发或生产性能。

   ```text
   cd ~/projects/contacts
   go test ./...
   ```

**完成后逐项验收**

- 流程图包含客户端、TCP、HTTP、handler、Store与JSON读写。
- 能解释GET/POST、头/体和HTTP/TCP各自职责。
- 每条请求日志含方法、路径、真实状态和耗时。
- 能用一条失败日志对应curl并定位输入层或存储层。

**保留的学习产物**

- 请求流程图与日志包装代码。
- 成功/失败请求日志对照与定位说明。

**问题排查**

- 日志所有请求都标200，即使curl返回404。：包装器截取首次WriteHeader并处理默认状态，增加httptest针对400/404的日志状态验证。
- 重定向日志后终端空白，认为服务未启动。：在另一终端tail日志并curl health；重定向改变输出位置，不改变前台服务是否运行。

**复盘问题**

- 如果JSON校验失败，TCP连接、HTTP响应和文件保存哪些仍发生？
- 记录原始请求体是否必要，哪些信息足够定位本阶段错误？

**参考资料**

- [李文周：网络编程与 HTTP](https://liwenzhou.com/posts/go/golang-menu/)
- [Go net/http：Handler、ServeMux与Server](https://pkg.go.dev/net/http)

**可选延伸（从已有预算中调配时间）**

- 非必做：加简单请求编号，从日志实现60分钟调配10分钟，不扩展完整分布式追踪。

### w03-t05 · 用 Linux 检查进程与端口（150 分钟）

操作：练习 ps、ss -lntp、curl、kill，启动两次相同端口的服务并分析报错；用 Ctrl+C 正常停止。验收：能找到监听 8080 的进程，解释端口占用与连接被拒绝的区别。

**学习目标：** 用ps、ss、curl与信号定位本机服务、进程和监听端口；区分端口被占用与连接被拒绝，只停止自己确认的通讯录进程。

**开始前确认**

- 已有serve模式并可curl访问，知道用两个Ubuntu终端。
- Linux工具不默认额外安装，先command -v检查；Go/Git/curl已安装。

**操作步骤**

1. **读进程和监听信息 · 20 分钟**

   - 阅读原中文资料任务控制段，用本机man查ps、ss和kill的参数；认识PID、LISTEN及127.0.0.1地址。
   - 先检查ps/ss是否存在；如果ss缺失，说明它来自iproute2，可按Ubuntu包管理安装该单一工具，不重装WSL/Go。
   - 写检查顺序：curl现象→ss监听→ps进程→服务日志；无权限看到其他用户进程不代表端口不存在。

   ```text
   cd ~/projects/contacts
   command -v ps
   command -v ss
   command -v curl
   man ss
   ```

2. **启动并找到自己的进程 · 30 分钟**

   - A终端先编译contacts-demo并以前台serve模式运行，比go run更容易识别实际服务进程。
   - B终端用ss查8080监听，再用ps按完整命令查看PID与父PID；记录自己程序的路径与用户名。
   - 理解go run可能有编译/子进程包装，PID不必等于终端shell；不能随意kill看到的第一个go进程。

   ```text
   cd ~/projects/contacts
   go build -o contacts-demo .
   ./contacts-demo serve
   ss -lntp 'sport = :8080'
   ps -u caolingyun -o pid,ppid,stat,args
   ```

3. **制造占用与拒绝两类故障 · 45 分钟**

   - A服务未停时，在B再次启动同端口程序，观察address already in use；记录失败实例退出，原实例仍能响应。
   - 回A按Ctrl+C停止，再B curl观察connection refused；此时ss应该没有本服务LISTEN。
   - 比较两类原因：绑定失败是本地已有监听，连接拒绝通常无监听或连接被主动拒绝；不把两者都归结为网络坏了。
   - 重新启动原服务，用curl health和contacts确认恢复；不改成公网监听来绕过本机端口冲突。

   ```text
   cd ~/projects/contacts
   ./contacts-demo serve
   curl -i http://127.0.0.1:8080/health
   ss -lntp 'sport = :8080'
   ```

4. **确认PID后发信号停止 · 35 分钟**

   - 只对ss/ps共同确认的本人contacts-demo PID执行kill -TERM，命令中的占位PID必须先替换为实际数字。
   - 再次ss与curl确认停止，再启动并Ctrl+C比较SIGTERM与SIGINT；当前阶段只说明正常发信号，不宣称已实现优雅等待请求。
   - 如果进程已经不存在，记录No such process为状态变化而非安装错误；不使用kill -9、killall或停止TodoList。

   ```text
   cd ~/projects/contacts
   ps -u caolingyun -o pid,ppid,args
   kill -TERM <已确认的本人通讯录PID>
   ss -lntp 'sport = :8080'
   ```

5. **做故障定位卡 · 20 分钟**

   - 整理两类故障的现象、证据、根因与恢复命令，每个命令写清执行终端与PID确认方法。
   - 从停止状态独立走一遍启动→查端口→curl→停止，保留可见输出并确认其他项目未被操作。
   - 理解监听成功与业务请求成功是两个层次，端口正常仍可能因JSON输入或存储失败返回4xx/5xx。

   ```text
   cd ~/projects/contacts
   curl -i http://127.0.0.1:8080/health
   go test ./...
   ```

**完成后逐项验收**

- 能用ss找到8080监听，用ps关联本人通讯录PID。
- 端口占用与连接拒绝分别有复现、证据和解释。
- Ctrl+C与确认PID后的TERM可停止服务，停止后不再LISTEN。
- 未停止其他程序，能按客户端→监听→进程→日志定位。

**保留的学习产物**

- 端口/进程命令卡和两类故障记录。
- 启动、观察、停止的完整终端输出。

**问题排查**

- ps看到了go但kill后服务仍在，或杀错进程。：先用编译后的contacts-demo定位，结合ss与ps的PID/命令/用户名；go run包装进程与服务子进程需区分。
- ss没有进程名，就以为服务没监听。：先看LISTEN和本地地址端口；进程详情可能受权限限制，结合本人ps和curl，不把权限不足当成无监听。

**复盘问题**

- 端口正常LISTEN为何仍可能收到500？
- 为什么比起killall go，确认具体PID更能避免影响其他项目？

**参考资料**

- [缺失的一课：命令行环境与调试](https://missing-semester-cn.github.io/)
- [缺失的一课中文：命令行环境与信号](https://missing-semester-cn.github.io/2020/command-line/)

**可选延伸（从已有预算中调配时间）**

- 非必做：观察jobs与后台任务，从信号练习35分钟调整10分钟，仅对自己启动的通讯录。

### w03-t06 · 栈、队列与链表基础（150 分钟）

操作：用切片实现栈和队列，写有效括号判断；手画并实现单链表反转。验收：两道题通过自建边界用例，能解释链表反转时为什么先保存 next。

**学习目标：** 通过切片栈/队列理解先进后出与先进先出，用有效括号和单链表反转练习不变量、指针顺序和边界测试。

**开始前确认**

- 会切片append/截取、结构体、指针与testing。
- 练习独立放contacts/exercises/linear，不新增根目录main。

**操作步骤**

1. **读结构并写不变量 · 20 分钟**

   - 阅读原中文切片/结构体段，画栈push/pop、队列enqueue/dequeue各3步，指出空结构不能直接取元素。
   - 有效括号约定仅接受()[]{}，遇其他字符按事先规则拒绝；先手算'([])'与'([)]'。
   - 画三个Node节点next关系，链表反转目标是边方向翻转；写prev、cur、next各表示什么。

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/linear
   go doc builtin.append
   ```

2. **切片栈队列与括号 · 30 分钟**

   - 自己实现最小栈与队列操作，空取值返回明确标记，不用复杂通用容器。
   - 用栈验证括号：右括号需要匹配栈顶，结束栈必须为空；代码前先写伪流程。
   - 用空串、单右括号、不闭合、错类型、嵌套正常五种输入预测并运行。

   ```text
   cd ~/projects/contacts
   go run ./exercises/linear
   ```

3. **手画与实现链表反转 · 45 分钟**

   - 自己定义Node含值与Next指针，构造三个节点，逐轮手画指针变化。
   - 每轮先保存原next，再让cur.Next指prev，最后推进prev和cur；只给操作顺序提示，函数由自己编写。
   - 反转后从新头遍历，确认结果3→2→1→nil；空链表与单节点也要返回正确。
   - 分别说明有效括号O(n)/O(n)、反转O(n)/O(1)额外空间；不把节点存储算作反转新分配空间。

   ```text
   cd ~/projects/contacts
   gofmt -w exercises/linear/main.go
   go run ./exercises/linear
   ```

4. **测试边界与坏指针排查 · 35 分钟**

   - 写表驱动括号测试和链表输出对比，链表至少空、单节点、三节点，验证没有丢节点或成环。
   - 遍历测试加有限步数检查，若访问超出预期节点数量说明可能成环；遇卡住用Ctrl+C停止再画指针。
   - 为队列连续出入留观察，说明简单切片队列可能保留底层数组，本项不优化成复杂循环队列。

   ```text
   cd ~/projects/contacts
   go test -v ./exercises/linear
   ```

5. **脱离代码口述并归纳 · 20 分钟**

   - 合上实现，口述右括号如何用栈，以及反转前为何保存next。
   - 保留两题思路、不变量、边界与最初错误；对比切片按下标访问和链表沿next访问的代价。
   - 回跑测试，把演示输出与测试断言区分，不只贴最终正确代码。

   ```text
   cd ~/projects/contacts
   go test ./exercises/linear
   ```

**完成后逐项验收**

- 栈/队列空取值不会越界，能解释两种顺序。
- 有效括号覆盖空、错误类型、不闭合与正常嵌套。
- 链表反转覆盖空、单节点、三节点，无丢失或成环。
- 能手画反转顺序与两题复杂度。

**保留的学习产物**

- exercises/linear的栈队列、括号与反转代码及测试。
- 指针手画过程、不变量和错题记录。

**问题排查**

- 遇首个右括号就panic，或未闭合左括号被判正确。：取栈顶前判空，结束时确认栈为空；给两个场景单独测试而非只看正常嵌套。
- 链表反转丢失后半段或遍历不结束。：改cur.Next之前保存next；逐轮画原边与新边，测试遍历限制步数并确认末尾指向nil。

**复盘问题**

- 反转时prev、cur、next必须保持怎样的关系？
- 队列功能正确与内存长期使用高效是不是同一验收？

**参考资料**

- [Go by Example：切片与结构体](https://gobyexample-cn.github.io/)
- [Go by Example 中文：切片](https://gobyexample-cn.github.io/slices)

**可选延伸（从已有预算中调配时间）**

- 非必做：用双栈实现队列，从编码45分钟调配10分钟，不增加题目验收范围。

### w03-t07 · 给 GitHub 项目补全接口说明（120 分钟）

操作：README 加入接口表、curl 示例、测试命令和当前限制；在分支修改并阅读 diff 后推送。验收：同学按文档能启动服务并新增一条联系人，记录其一个使用反馈。

**学习目标：** 把HTTP通讯录整理成他人可按README运行和测试的仓库，补接口契约、curl示例与限制，在分支审阅后推送，并获取一次真实使用反馈。

**开始前确认**

- 第2周本人远程仓库已建立，HTTP接口与测试已通过。
- 文档只描述已实现能力；不写生产级、认证安全或未测性能。

**操作步骤**

1. **按使用者视角列文档范围 · 20 分钟**

   - 阅读Git官方共享修改段，先检查当前分支、工作区和远程；记录真实项目启动条件。
   - 列README必须项：Ubuntu/Go实测版本、clone/运行目录、CLI/serve模式、数据路径、测试、停止服务。
   - 接口表列方法/路径/输入/成功状态/失败状态，把请求体上限、单进程JSON和本机监听限制写出。

   ```text
   cd ~/projects/contacts
   git status
   git branch --show-current
   git remote -v
   ```

2. **在文档分支补可复制例子 · 35 分钟**

   - 创建docs/http分支，自己写GET、POST、DELETE curl；删除例子ID提示由POST结果取得，不硬编码必定存在的1。
   - 新增初始化空数据、损坏文件提示与凭据禁止入库说明；命令中带明确cd和实际仓库地址替换指引。
   - 加入go test ./...与-race命令，解释测试范围；不要粘贴含真实联系人/令牌的终端全屏截图。

   ```text
   cd ~/projects/contacts
   git switch -c docs/http
   git diff -- README.md
   ```

3. **复现并邀请反馈 · 40 分钟**

   - 用第2周独立clone目录更新到文档分支，按README逐行操作；操作前确认该副本没有需保留的改动。
   - 请一位同学按说明启动并新增虚构联系人，记录其一个具体反馈；自己先确认示例可执行，不能把未验证文档直接交给对方。
   - 同学暂不可用时做自查但标注外部反馈尚未完成，不编造反馈；把阻碍和下次验证时间写清。
   - 从反馈选一处真实不清之处修正文档，例如执行终端、状态码或ID替换；重跑受影响例子。

   ```text
   cd ~/projects/contacts
   go test ./...
   go test -race ./...
   git diff --check
   ```

4. **审查、提交与推送 · 25 分钟**

   - 读README diff和暂存diff，再提交，切回实际主分支合并；推送使用已核对origin和真实分支。
   - 网页核对最新README与提交，确认接口说明和测试命令可找到。
   - 写一段反馈→修改→复验结果；若接口测试或文档有失败，先修复再标完成，不用美化README掩盖。

   ```text
   cd ~/projects/contacts
   git add README.md
   git diff --cached
   git status
   git log --oneline -5
   ```

**完成后逐项验收**

- README具备启动、接口表、curl、测试与真实限制。
- 所有文档示例在独立副本可执行，数据不依赖原目录。
- 分支修改经diff审阅、合并并推送到本人仓库。
- 同学能启动新增并留一个真实反馈；无反馈时明确未完成此项。

**保留的学习产物**

- 更新的README、接口示例和文档提交历史。
- 独立复现与同学反馈/修正记录。

**问题排查**

- 示例DELETE总404，或新clone不知道数据文件在哪。：ID来自本次POST返回值；写清工作目录和首次空数据规则，不要求复制原目录运行JSON。
- 文档说支持功能，但实际接口没有实现或测试失败。：按当前代码逐项核验，删除不实承诺或标明限制；完成回归后再更新验收状态。

**复盘问题**

- 同学的反馈暴露了哪个你默认知道、文档却没写的前提？
- 为什么可复制curl比只有接口路径列表更适合交付验收？

**参考资料**

- [缺失的一课：版本控制](https://missing-semester-cn.github.io/)
- [Git 官方 tutorial](https://git-scm.com/docs/gittutorial)
- [Go net/http：Handler、ServeMux与Server](https://pkg.go.dev/net/http)

**可选延伸（从已有预算中调配时间）**

- 非必做：补一个请求流程小图，从复现40分钟调整10分钟，不取代真实复现与反馈。

### w03-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟从浏览器请求讲到文件保存，标出说不清的环节；30 分钟离屏活动。验收：留下流程图与 3 条复盘，实际时长超预算时缩减下周任务范围。

**学习目标：** 用30分钟从浏览器请求讲到文件保存，检验HTTP、并发和Linux排错的理解；留下流程图与三条复盘，再用30分钟离屏活动恢复精力。

**开始前确认**

- 有API请求、日志、测试、端口故障和README交付记录。
- 每周20小时保持不变，下一周进入MySQL前只选最关键的遗留项。

**操作步骤**

1. **流程复述与证据复盘 · 30 分钟**

   - 前10分钟不看代码从浏览器/curl讲到TCP、HTTP、handler、Store、锁和JSON保存，边讲边画图，标出说不清的箭头。
   - 中10分钟写三条复盘：一个独立完成的能力、一条真实排错证据、一个并发或协议理解缺口；核对实际时长与未完成项。
   - 后10分钟对照下一周MySQL迁移，选必须保留的接口/测试契约；若本周超预算，缩减下周非关键延伸并明确优先级。
   - 区分自动测试通过、人工curl成功和同学复现三类证据：它们各自覆盖的行为不同。没有获得反馈就保留未完成标记，不能用自己的演示代称他人验收。

   ```text
   cd ~/projects/contacts
   go test ./...
   git log --oneline -5
   ```

2. **离屏活动与休息 · 30 分钟**

   - 关掉终端、编辑器和教程，散步或伸展30分钟；不在手机继续查HTTP与数据库，把这段时间真正留给离屏活动。
   - 记录活动时长与下次学习安排；结束后不追加新功能，只留下需要下一周验证的一个问题。

**完成后逐项验收**

- 流程图包含请求与保存方向，标注至少一个说不清环节。
- 留下三条具体复盘及对应代码/日志/测试位置。
- 记录实际时长、下周范围调整，完成30分钟离屏活动。

**保留的学习产物**

- 第3周流程图与三条复盘记录。
- 实际时长、遗留优先级与休息记录。

**问题排查**

- 能背HTTP定义，却解释不了自己的handler如何调用Store。：沿一次真实请求画调用和数据流，在具体日志与代码位置停下核对，不用抽象术语替代流程。
- 把超出的时长与所有未完成延伸加到下周。：先保留核心CRUD与测试，裁掉非关键延伸，在1200分钟中替换任务范围，不削减离屏休息。

**复盘问题**

- 从客户端到文件的哪个箭头最难解释，需要怎样的小实验验证？
- 并发测试、端口检查和同学复现分别让你相信了什么，又没验证什么？

## 第 4 周：把通讯录迁移到 MySQL

目标：理解表、SQL、索引和 database/sql，用数据库完成通讯录 CRUD 并保存可演示版本。

### w04-t01 · 准备本地 MySQL 并设计联系人表（180 分钟）

操作：在 Ubuntu 本机准备 MySQL，创建学习库与权限受限的应用用户；设计 contacts 表和唯一约束，写建表 SQL。验收：命令行完成插入、查询、更新、删除，能解释主键、NOT NULL 与唯一约束。

**学习目标：** 在已配置的WSL Ubuntu中先检测再安装MySQL，用专用学习库和受限账号建立联系人表，避免与现有文件或TodoList数据混用。

**开始前确认**

- 第3周~/projects/contacts的HTTP服务可在127.0.0.1:8080运行，文件写入有互斥与安全保存
- 本机 Ubuntu 24.04.5、用户 caolingyun、Go 1.27.2 已核实；PID 1 为 systemd，换电脑时重新检查
- MySQL尚未确认存在，本任务先核验，不预设服务可用

**操作步骤**

1. **检测已有数据库环境 · 25 分钟**

   - 在Ubuntu终端检查mysql客户端、mysqld包及3306监听，记录实际版本/是否缺失
   - 检查 PID 1；本机使用 systemd，其他环境按实际初始化系统选择 systemctl 或 service
   - 确认项目pwd，TodoList8787与contacts8080都不是MySQL端口

   ```text
   cd ~/projects/contacts
   command -v mysql
   command -v service
   dpkg-query -W mysql-server
   ps -p 1 -o comm=
   ss -lntp
   ```

2. **按Ubuntu路线安装和启动 · 40 分钟**

   - 仅当缺少服务器时按官方Ubuntu文档使用apt安装mysql-server；已有则先查版本，不重复配置
   - PID 1 为 systemd 时使用 sudo systemctl start/status mysql；其他环境仅在存在 mysql 启动脚本时使用 sudo service mysql start/status
   - 保持回环/本机使用，用sudo mysql验证管理员连接，记录服务实际启动结果

   ```text
   cd ~/projects/contacts
   # 仅缺少mysql-server时：
   sudo apt update
   sudo apt install mysql-server
   # PID 1 为 systemd 时（本机当前配置）：
   sudo systemctl start mysql
   sudo systemctl status mysql
   # 仅检测到/etc/init.d/mysql且PID1非systemd时：
   sudo service mysql start
   sudo service mysql status
   sudo mysql
   ```

3. **创建库与最小权限 · 35 分钟**

   - 在管理员会话创建contacts_dev和contacts_test，不碰其他库
   - 创建仅本机登录的contacts_app与contacts_test_app，应用仅授予对应库SELECT/INSERT/UPDATE/DELETE；管理员交互执行CREATE USER后GRANT对应库DML，再用SHOW GRANTS核对，示例笔记只保留占位密码。
   - 密码由本人单独生成并在本机会话输入，迁移管理员与应用账号分离，禁止root作为Go账号

4. **设计并保存联系人表 · 45 分钟**

   - 写migrations/001_contacts.sql：BIGINT主键ID、自增、name非空、phone非空且唯一，InnoDB/utf8mb4
   - 电话用VARCHAR保留前导零，不用整数；服务层仍检查空字符串与长度，NOT NULL不拒绝空串
   - 管理员执行迁移，版本记录区分已执行与待执行，后续变更写新文件不DROP已有数据

   ```text
   cd ~/projects/contacts
   mkdir -p migrations scripts docs
   sudo mysql contacts_dev < migrations/001_contacts.sql
   sudo mysql contacts_dev -e 'SHOW CREATE TABLE contacts;'
   sudo mysql contacts_test < migrations/001_contacts.sql
   ```

5. **验证SQL与权限 · 35 分钟**

   - 编写scripts/sql-smoke.sql只用虚构姓名/电话，执行insert/select/update/delete并查询最终状态
   - 应用账号试图建表应被拒绝，确认权限范围与数据库实际名
   - 保留迁移、脱敏结果与版本笔记；若安装超时先缩减可选项，未成功不勾选

   ```text
   cd ~/projects/contacts
   mysql -u contacts_app -p contacts_dev < scripts/sql-smoke.sql
   ```

**完成后逐项验收**

- 管理员与应用账号能按各自职责连接
- 学习库contacts_dev/contacts_test分离
- SQL四种操作实际验证且无真实联系人
- 能解释主键、NOT NULL、唯一电话和受限权限

**保留的学习产物**

- 编号迁移及虚构SQL演示脚本
- 环境/权限与执行记录
- 表字段说明

**问题排查**

- systemctl提示系统未以systemd启动：先运行 ps -p 1 -o comm= 核实当前环境；非 systemd 环境核对 Ubuntu 包及启动脚本后使用 service。
- 手机号前导零丢失或空名字仍入库：电话使用字符串；NOT NULL只防NULL，空串和长度还需Go输入校验及边界测试。

**复盘问题**

- 数据库表主键与通讯录JSON的ID如何对应？
- 应用为什么不需要管理员建表权限？

**参考资料**

- [李文周：Go 操作 MySQL](https://liwenzhou.com/posts/go/golang-menu/)
- [Ubuntu官方：安装与配置MySQL（2026-10-12已打开核对）](https://ubuntu.com/server/docs/how-to/databases/install-mysql/)
- [李文周：Go 操作 MySQL](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟比较VARCHAR长度和字符集，替换字段笔记时间；不在本周改WSL启动方式或开放外网数据库。

### w04-t02 · 用 database/sql 连接 MySQL（180 分钟）

操作：为通讯录项目引入 MySQL 驱动，使用 database/sql、PingContext 与参数化查询；连接串从环境变量读取。验收：Go 能新增和查询联系人，数据库密码没有进入 Git，连接失败时能给出明确错误。

**学习目标：** 用database/sql与成熟MySQL驱动连接学习库，在Go中完成参数化插入/查询，并实测启动连接与请求超时。

**开始前确认**

- contacts_dev表及contacts_app受限账号已验证
- ~/projects/contacts已有Go模块和CLI/HTTP代码
- 密码不进源码、README、提交或终端截图，使用本机环境变量

**操作步骤**

1. **核对驱动并引入 · 30 分钟**

   - 阅读go-sql-driver/mysql官方包说明，选择与Go1.27.2兼容的版本，保存go.mod/go.sum
   - 导入驱动注册sql.Open的mysql名称；database/sql是通用池接口并非MySQL实现
   - 新增仅连接/插入/查询的练习入口，暂不一次性重写HTTP

   ```text
   cd ~/projects/contacts
   go get github.com/go-sql-driver/mysql@'<核验兼容Go1.27.2的版本>'
   go doc database/sql.DB.PingContext
   ```

2. **配置并真实建立连接 · 40 分钟**

   - 从CONTACTS_DSN读配置，缺失即明确启动错误，不提供硬编码密码回退
   - DSN注明contacts_dev、回环TCP/Unix socket选择、驱动连接timeout及读写超时；不记录整串
   - sql.Open不保证数据库在线，用短context调用PingContext验证后才启动服务

   ```text
   cd ~/projects/contacts
   # 在当前Shell交互粘贴本机DSN，输入不回显，不打印值：
   read -r -s -p '本机contacts_dev DSN: ' CONTACTS_DSN
   export CONTACTS_DSN
   ```

3. **插入与按ID查询 · 45 分钟**

   - 自己写ExecContext的INSERT ... VALUES (?,?)并检查LastInsertId
   - QueryRowContext按id=?查询，Scan到Contact字段，sql.ErrNoRows转换为未找到
   - 占位符传入姓名/电话值，不把字符串fmt.Sprintf到SQL；试含引号姓名验证语义

4. **实现列表并释放资源 · 35 分钟**

   - QueryContext得到rows后成功即defer rows.Close，逐行Scan，最后检查rows.Err
   - 排序显式ORDER BY id，空列表按已有HTTP契约处理
   - DB长期复用不每请求Open/Close；只在程序结束Close，先设置小池上限避免无界连接

5. **验证连接失败与秘密边界 · 30 分钟**

   - 用独立错误端口/错误账号配置测试Ping失败，恢复后可新增并读取
   - 所有查询接ctx，连接timeout与请求deadline分别记录；不要声称驱动一定即时取消
   - 检查diff只含占位配置示例，.env先忽略；编写TestSQLInsertAndRead独立读取TEST_CONTACTS_DSN，并SELECT DATABASE()校验只允许contacts_test，禁止回退开发DSN。

   ```text
   cd ~/projects/contacts
   go test ./... -run 'SQLInsertAndRead|DSN|Connect' -v
   git diff
   git check-ignore .env
   ```

**完成后逐项验收**

- Go新增再查询得到相同ID/字段
- 含引号输入仍作为值而非SQL执行
- Ping实际发现错误连接配置
- rows正确关闭/检查且Git无凭据

**保留的学习产物**

- SQL连接与CRUD练习代码
- 脱敏配置说明与失败记录
- 独立测试库插入查询测试

**问题排查**

- sql.Open成功却启动后第一请求报连接错误：Open主要建立池配置，启动时用有deadline的PingContext做实际连接。
- 查询跑久后池耗尽：检查rows关闭、Scan/Err错误路径和事务退出，复用DB，不用增大池掩盖泄漏。

**复盘问题**

- database/sql.DB为什么更像连接池而不是单条连接？
- 连接超时与一次查询的context deadline解决什么不同问题？

**参考资料**

- [李文周：database/sql 与 MySQL](https://liwenzhou.com/posts/go/golang-menu/)
- [Go MySQL驱动官方包说明（2026-10-12已打开核对）](https://pkg.go.dev/github.com/go-sql-driver/mysql)
- [李文周：database/sql 与 MySQL](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟读driver.Config与FormatDSN，替换配置说明整理；不引入ORM，也不自己实现驱动。

### w04-t03 · 替换 HTTP 服务的存储实现（180 分钟）

操作：保留 HTTP 请求格式，把文件存储替换为数据库 CRUD；为请求使用 context 超时，正确关闭 rows 并检查 rows.Err。验收：原有 curl 演示仍可用，重启服务后数据保留，重复电话和不存在 ID 都得到明确响应。

**学习目标：** 保留第3周HTTP请求/响应契约，替换联系人存储为MySQL，贯通请求Context并真实验证持久化与并发新增。

**开始前确认**

- SQL参数化插入/查询能运行，contacts_dev已有虚构记录
- 已有GET/POST/DELETE及httptest，JSON文件存储有互斥和失败保护
- 保留原contacts.json备份，不直接把真实个人通讯录导入实验库

**操作步骤**

1. **画存储替换边界 · 30 分钟**

   - 列现有handler调用的新增/查询/列表/删除方法，保持HTTP字段与状态码
   - 只在需要替换/测试的位置定义小接口，不加全套service框架
   - 保留文件实现作为参考或选项，新SQL实现不继续写原JSON文件

2. **完善SQL CRUD · 45 分钟**

   - 列表/查询用QueryContext/QueryRowContext，新增/删除用ExecContext且全部参数化
   - DELETE WHERE id=?检查RowsAffected，0转换404；不存在查询用ErrNoRows
   - 重复phone使用驱动错误码识别唯一冲突并转409，其他SQL错不直接返原始信息

3. **接上请求取消与超时 · 35 分钟**

   - handler从r.Context派生短timeout并defer cancel，把ctx传至存储
   - Query返回rows后关闭且检查Err，错误出口也释放资源
   - 启动复用一个DB池；HTTP仍绑定127.0.0.1:8080，不占TodoList8787；切换前先停止自己第3周启动的文件版服务，避免8080占用。

4. **回归与并发持久化 · 40 分钟**

   - 用第3周curl成功/错误集复测，先保存scripts/contact-demo.json虚构新增体再执行
   - 同时两次新增用不同电话，响应ID都存在；相同电话并发只有一个创建并返回冲突
   - 停止再启动Go服务后查记录仍在DB，数据保持由MySQL负责而非旧内存Mutex

   ```text
   cd ~/projects/contacts
   go run .
   # 另开Ubuntu终端，继承本机安全配置后：
   cd ~/projects/contacts
   curl -i -H 'Content-Type: application/json' --data @scripts/contact-demo.json http://127.0.0.1:8080/contacts
   curl -i http://127.0.0.1:8080/contacts
   ```

5. **测试与迁移说明 · 30 分钟**

   - 保留httptest验证HTTP；真SQL集成仅contacts_test，启动核对库名不符就拒绝
   - 测试自己命名的TestSQLCRUD/TestHTTPRegression，-v无用例不算通过
   - 说明不再写JSON、真实数据未迁移、现有时间/身份能力仍有限

   ```text
   cd ~/projects/contacts
   go test ./... -run 'SQLCRUD|HTTPRegression' -count=1 -v
   go test -race ./...
   ```

**完成后逐项验收**

- 原HTTP成功/失败契约保持一致
- 重启服务后虚构联系人仍存在
- 未知ID404、重复电话409
- 两个不同电话并发新增均保留且测试库隔离

**保留的学习产物**

- SQL存储适配及回归测试
- curl/重启/并发演示记录
- 存储切换与限制说明

**问题排查**

- 删除不存在ID仍返回成功：读取RowsAffected并将0转为契约404，HTTP测试必须覆盖未知ID。
- 重复电话SQL错误直接泄露库表与连接信息：按MySQL唯一冲突码映射409，客户端返回稳定错误，内部只记脱敏原因。

**复盘问题**

- 数据库实现哪些并发保证取代了文件存储的Mutex？
- 为什么HTTP单测通过仍需要真实SQL集成验证？

**参考资料**

- [李文周：MySQL 与 Context](https://liwenzhou.com/posts/go/golang-menu/)
- [Go MySQL驱动官方包说明（2026-10-12已打开核对）](https://pkg.go.dev/github.com/go-sql-driver/mysql)
- [李文周：MySQL 与 Context](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟为文件/SQL实现复用一组存储契约测试，替换切换文档润色；不导入真实个人数据。

### w04-t04 · 检查索引与数据库边界（180 分钟）

操作：准备一批测试联系人，用 EXPLAIN 比较有无姓名索引的查询；测试空值、重复键和数据库停机。验收：保存建表脚本、EXPLAIN 结果和错误处理说明，能解释索引为何有读写成本。

**学习目标：** 用真实EXPLAIN理解索引选择与成本，在独立学习数据中验证NULL、重复键和数据库不可达等边界。

**开始前确认**

- MySQL联系人CRUD与HTTP回归已可运行
- contacts_test独立测试库和受限测试账号已创建
- 先通过管理员迁移建表，数据量和实验结果都如实记录

**操作步骤**

1. **准备可比较数据 · 30 分钟**

   - 编写scripts/seed-explain.sql在contacts_test插入约定规模虚构联系人，姓名分布含常见及少见值
   - 固定查询WHERE name=?的精确查找与一个排序场景，保存实际行数
   - 测试启动核对库名，清理仅本次生成ID，不清空contacts_dev

2. **获取无姓名索引基线 · 40 分钟**

   - 确认SHOW INDEX中当前仅主键/电话唯一等索引，记录表真实结构
   - 执行EXPLAIN SELECT ... WHERE name='虚构少见名'并读type/key/rows/Extra
   - 说明rows为估计，EXPLAIN计划不是查询实测耗时；若小表全扫正常也记录

   ```text
   cd ~/projects/contacts
   mysql -u contacts_test_app -p contacts_test -e "EXPLAIN SELECT id,name,phone FROM contacts WHERE name='虚构少见名';"
   ```

3. **加索引后再次比较 · 40 分钟**

   - 管理员在测试库创建name索引，重新执行完全相同查询并保留前后计划
   - 优化器可能仍选择全表扫，结合行数/选择性解释，不能强制写出性能提升
   - 确认后若要应用到开发库写新编号迁移，不把手工试验当已升级

   ```text
   cd ~/projects/contacts
   sudo mysql contacts_test -e 'CREATE INDEX idx_contacts_name ON contacts(name);'
   mysql -u contacts_test_app -p contacts_test -e "EXPLAIN SELECT id,name,phone FROM contacts WHERE name='虚构少见名';"
   ```

4. **边界与故障验证 · 40 分钟**

   - 在测试库尝试NULL姓名与重复电话，核对数据库拒绝；空串需API校验另测
   - 用实验服务连接无人监听回环端口模拟不可达，优先不停止共用MySQL
   - 检查错误响应不含密码/DSN，ctx能结束失败等待，恢复配置后请求成功

5. **写事实与成本结论 · 30 分钟**

   - 保存建表/索引脚本、数据量、两份EXPLAIN和实际失败响应
   - 解释索引增加磁盘与写入维护成本，不给所有字段建索引
   - 先通过本周正确性检查再讨论优化，没测耗时就只说计划变化

   ```text
   cd ~/projects/contacts
   go test ./... -run 'Duplicate|Null|DBUnavailable' -v
   git diff -- migrations docs
   ```

**完成后逐项验收**

- 同查询前后EXPLAIN及真实行数可回查
- 正确区分估计扫描行数与实测时间
- NULL/重复电话/不可达有实际结果
- 新索引更改有编号迁移及成本说明

**保留的学习产物**

- 数据生成及索引迁移
- EXPLAIN前后记录
- 边界与恢复验证卡

**问题排查**

- 少量数据加索引后仍ALL便认定索引坏了：核对查询条件/列类型，考虑表规模与选择性；优化器可合理选择扫描，不伪造改善。
- 停MySQL影响同机其他项目：优先用独立实验服务的错误目标端口；必须停服务时确认仅自己的专用实例并有恢复步骤。

**复盘问题**

- name索引为什么未必帮助'%关键词%'查找？
- 重复电话由唯一约束处理，空名字由谁拒绝？

**参考资料**

- [李文周：MySQL 学习条目](https://liwenzhou.com/posts/go/golang-menu/)
- [MySQL官方EXPLAIN（2026-10-12已打开核对）](https://dev.mysql.com/doc/refman/8.0/en/explain.html)
- [李文周：MySQL 学习条目](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟实际测同查询耗时并记录环境，替换计划解读整理；只作观察，不写简历提升百分比。

### w04-t05 · 进程、线程、文件与 Linux 日志（150 分钟）

操作：结合 ps、top、/proc 观察 Go 与 MySQL 进程，写下进程、线程、文件描述符的区别；重定向服务日志并用 tail 查看。验收：能解释程序与进程不同，定位一次连接失败在客户端、服务还是数据库。

**学习目标：** 用Linux进程、线程、文件描述符与日志观察一次HTTP到数据库访问，按边界定位连接失败而非盲目重启。

**开始前确认**

- ~/projects/contacts的HTTP8080与MySQL本机连接可用
- 日常Ubuntu用户caolingyun不以root运行Go
- 只读观察自己的进程，不停止TodoList8787或共用数据库

**操作步骤**

1. **辨认程序与进程 · 25 分钟**

   - 用ps找到Go真实服务PID，区分go run包装进程和编译后的服务子进程
   - 记录MySQL PID与用户，理解磁盘可执行文件是程序、启动后执行实体是进程
   - 不靠模糊名字kill进程，先核对监听端口和args

   ```text
   cd ~/projects/contacts
   ps -eo user,pid,ppid,nlwp,stat,comm,args
   ss -lntp
   ```

2. **观察线程与CPU · 30 分钟**

   - 用ps -L查看Go线程，用top观察一段短请求期间CPU
   - 线程共享同一进程地址空间，goroutine由Go调度不与线程一一对应
   - 保存采样时间、PID与真实数字，CPU低不能证明数据库没有等待

   ```text
   cd ~/projects/contacts
   ps -L -p '<自己的Go服务PID>' -o pid,tid,stat,comm
   top -H -p '<自己的Go服务PID>'
   ```

3. **看文件描述符 · 30 分钟**

   - 查看/proc/PID/fd中0/1/2与socket链接，辨认标准输入/输出/错误
   - 数据库TCP连接与HTTP监听都表现为进程持有的socket资源
   - 看不到MySQL用户fd可能是权限限制，只解释已可见部分，不chmod开放进程目录

   ```text
   cd ~/projects/contacts
   ls -l '/proc/<自己的Go服务PID>/fd'
   cat '/proc/<自己的Go服务PID>/status'
   ```

4. **记录与筛选日志 · 35 分钟**

   - 创建logs目录并忽略，将Go开发服务输出/错误重定向logs/dev.log；先停止自己旧的8080进程再重启重定向版本，不碰8787。
   - 记录方法/路径/状态/耗时或原有request_id，禁止密码、Authorization及DSN全文
   - 先保存正常请求再用grep/tail找一条失败，字段不够时补最少日志

   ```text
   cd ~/projects/contacts
   mkdir -p logs
   go run . > logs/dev.log 2>&1
   # 另一个Ubuntu终端：
   cd ~/projects/contacts
   tail -n 30 logs/dev.log
   grep -n -E 'error|timeout|request_id' logs/dev.log
   ```

5. **做一张分层定位卡 · 30 分钟**

   - 以错端口实验说明curl连接拒绝在服务之前，HTTP500则说明已进服务
   - 服务日志Ping/SQL失败再核对数据库地址、监听、账号权限，不直接改业务算法
   - 每条结论写现象、命令、证据、恢复请求；敏感输出先遮盖再分享

**完成后逐项验收**

- 能解释程序/进程/线程/FD区别
- 定位真实服务PID和监听8080
- 日志可按失败现象筛选且无凭据
- 连接失败定位到客户端/Go/MySQL具体边界

**保留的学习产物**

- 进程线程FD观察笔记
- 脱敏服务日志样本
- 分层故障定位卡

**问题排查**

- 观察到的go run PID没有监听端口：查看父子PID/args与ss对应的真实server进程，再读该进程/proc。
- 查看其他用户/proc/fd报权限不足：记录权限边界，仅观察自己Go进程；不为截图修改/proc权限或长期用root运行服务。

**复盘问题**

- 一个socket为什么也出现在fd列表？
- 数据库拒绝连接与HTTP404为什么排查方向不同？

**参考资料**

- [缺失的一课：调试与性能分析](https://missing-semester-cn.github.io/)
- [Ubuntu官方：安装与配置MySQL（2026-10-12已打开核对）](https://ubuntu.com/server/docs/how-to/databases/install-mysql/)
- [缺失的一课：调试与性能分析](https://missing-semester-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟观察一个成功请求的短TCP连接，替换笔记整理；采样没抓到连接如实记录，不安装监控平台。

### w04-t06 · 排序与双指针练习（150 分钟）

操作：手写一种基础排序，再用 sort 包练习有序数组去重与移动零；每题先写思路再编码。验收：2 道题覆盖空数组、全重复元素，说明排序和双指针的复杂度。

**学习目标：** 手写一种基础排序，再以双指针完成有序数组去重和移动零，先写不变量与边界，再用测试校验修改范围。

**开始前确认**

- 已熟悉Go切片、for与第1周二分有序前提
- 题目约定整数切片且允许原地修改
- 算法放独立exercises包，不改变通讯录HTTP或数据库数据

**操作步骤**

1. **明确三项练习契约 · 25 分钟**

   - 手写插入排序用于理解，标准库sort用于日常代码，不能混报复杂度
   - 有序去重返回有效长度k，只保证a[:k]去重有序，不要求尾部内容
   - 移动零保持所有非零元素的相对顺序，准备空/全相同/全零/负数输入

2. **实现插入排序 · 30 分钟**

   - 画[3,1,2]每轮将当前值插入左侧已排序区间的过程
   - 从后向前挪动较大元素，保存当前值避免被覆盖
   - 说明最好O(n)、最坏O(n²)，原地O(1)辅助空间；不把这当数据库索引算法

3. **实现有序去重 · 35 分钟**

   - 读指针逐项读，写指针只在发现新值时写入并前进
   - 输入为空先返回0，初始首项有效，保留“a[:write]是已读前缀去重结果”不变量
   - 不对无序切片直接用相邻比较；若先排序必须说明改变原输入和额外时间

4. **实现稳定移动零 · 35 分钟**

   - 先用写指针按读顺序放非零，最后把剩余位置写0
   - 相对顺序需测试[0,-1,0,2,-1]，不能用末尾元素交换破坏顺序
   - 两题O(n)/O(1)，测试保留原输入副本用于检查稳定性

   ```text
   cd ~/projects/contacts
   mkdir -p exercises/arrays
   go test ./exercises/arrays -v
   ```

5. **标准库与边界回归 · 25 分钟**

   - 写表驱动测试覆盖空、单项、全重复/全零、已经有序与反序
   - 用sort.Ints结果对照手写排序，记录一次实际越界或初值错误
   - 关闭参考后口述两题写指针意义，超时保留卡点不新增题

   ```text
   cd ~/projects/contacts
   go doc sort.Ints
   go test ./exercises/arrays -count=1
   ```

**完成后逐项验收**

- 插入排序与标准库结果一致
- 去重返回k及前缀符合契约
- 移动零非零顺序保持
- 能解释三种实现复杂度和输入会被修改

**保留的学习产物**

- 排序与双指针源码
- 表驱动边界测试
- 循环不变量及错题笔记

**问题排查**

- 空数组去重访问a[0]崩溃：先判断len==0，再进入首项初始化；空输入单独回归。
- 移动零用交换末尾导致非零顺序变了：采用从左向右写非零再填零方案，用带重复和负数的次序断言验证。

**复盘问题**

- 去重后为什么不能直接用整个原切片当结果？
- sort与双指针分别贡献了多少时间成本？

**参考资料**

- [Go by Example：排序](https://gobyexample-cn.github.io/)
- [Go by Example：排序](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟生成短随机数组对照sort，调配口述时间；不额外加入第三道新算法题。

### w04-t07 · 通讯录里程碑与第一次岗位收集（120 分钟）

操作：为通讯录补启动、建表、环境变量、测试说明并推送；收集北上广深杭 10 个 Go 后端实习岗位，记录技能、城市、到岗时长和投递入口。验收：有可运行通讯录与岗位表，注明宜昌就读、可实习时间和需要确认的到岗安排。

**学习目标：** 把已完成通讯录整理为真实可复现的阶段作品，从企业官方入口收集匹配实习条件，给第5周开始投递准备证据。

**开始前确认**

- 第3/4周HTTP、MySQL及回归已有实际结果
- 本人可确认研一课程、导师安排、宜昌所在地与可到岗时间
- 岗位开放情况随时间变动，当前任务收集不承诺面试机会

**操作步骤**

1. **整理项目证据 · 30 分钟**

   - README写Ubuntu/Go/MySQL实测版本、启动8080、迁移、环境变量占位和测试库说明
   - 保存CLI→JSON→HTTP→MySQL的已实现演示，说明原文件未直接导入真实数据
   - 只写已完成状态与测量，未测性能与未来预约功能不得当成果

2. **本地检查和里程碑 · 25 分钟**

   - 确认.env、日志、二进制、个人数据未跟踪，.gitignore不自动移除已跟踪秘密
   - 阅读diff并作本地提交，远程地址由本人核验，推送由本人操作，本计划编写不执行
   - 新临时目录从本地仓库clone按README测试，缺配置用占位说明而非放密码

   ```text
   cd ~/projects/contacts
   git status --short
   git diff
   git ls-files
   git clone ~/projects/contacts '/tmp/contacts-repro-<日期>'
   ```

3. **收集并筛选岗位 · 40 分钟**

   - 从字节校园招聘等本人确认的企业官网筛选Go/后端实习，目标10项，城市北上广深杭仅在有实际职位时记录
   - 每项保存岗位名、官方URL、查阅日期、技能、硕士资格、每周天数、连续月份和到岗要求
   - 机会不足就记录真实数量及原因，不能猜实时岗位、写不存在的职位或为了数量忽略匹配

4. **准备投递条件与表达 · 25 分钟**

   - 表中明确本人在宜昌读研、可能迁往城市、可开始日期和每周出勤，未知项列待确认
   - 用两分钟介绍通讯录一次请求到数据库、一个自己修复的错误，区分AI参考与独立改动
   - 选第5周投递候选3–5项并记录需补的证据；联系招聘方或提交由本人按真实入口进行

**完成后逐项验收**

- 通讯录按说明能复现且测试证据真实
- 库/配置/数据不泄露凭据
- 岗位表10项或如实记录数量不足
- 到岗和研究生实习条件明确待确认项

**保留的学习产物**

- 通讯录README与演示证据
- 岗位条件跟踪表
- 两分钟项目提纲

**问题排查**

- 岗位表只写城市和薪资却缺出勤要求：优先记录硕士资格、每周天数、连续月份及开始日期，不符本人安排先标不匹配。
- 仓库里曾提交.env但新加忽略仍可见：用ls-files确认；保留本机文件并移出索引，若真实秘密已暴露先处理凭据再分享。

**复盘问题**

- 哪个已完成改动最能证明你能独立定位故障？
- 到岗条件尚未确认时应怎样诚实填写申请资料？

**参考资料**

- [字节跳动校园招聘官方入口（2026-10-12已打开，仅供当次核验岗位）](https://jobs.bytedance.com/campus/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟请同学按README复现，替换提纲练习；不把收集数量或完成项目等同拿到面试。

### w04-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟演示从 CLI 到 JSON、HTTP、MySQL 的变化，列出下阶段设备预约的最小功能；30 分钟离屏休息。验收：提交通讯录演示记录和 5 条设备预约需求，不给尚未实现的能力写结论。

**学习目标：** 用半小时对照通讯录四阶段的真实实现，确定下一项目的五个最小场景和知识缺口，再完整离屏恢复。

**开始前确认**

- 第1–4周已有可查提交、测试与演示记录
- 本周实际耗时和未完成项已记下，不能以计划标题代替实现结果
- 本次共60分钟计入每周1200分钟，不额外补做数据库练习

**操作步骤**

1. **四阶段复盘与下周取舍 · 30 分钟**

   - 前10分钟演示或口述CLI内存→JSON文件→HTTP共享状态→MySQL，分别指出持久化、互斥和错误检查位置
   - 中间10分钟选一个真实数据库/HTTP错误按现象→命令→证据→修复→回归写五句话，注明尚未验证的取消或边界
   - 最后10分钟列设备列表、学生预约、本人记录、本人取消、管理员启停五个场景，明确新项目~/projects/lab-booking与contacts/TodoList并列
   - 累计本周实际分钟，把安装或回归未完成项标阻塞先处理；第5周取消可选延伸再调配，禁止用未来功能填补本周成绩

2. **主动离屏休息 · 30 分钟**

   - 关闭编辑器与教程，散步、喝水或轻度伸展，眼睛离开屏幕完整半小时
   - 不在休息段安装新软件、看招聘页面或重跑失败测试，想法最多记一句留到下周
   - 允许能力仍有未掌握部分，用可复现动作而非任务勾选评价进步
   - 结束后只记录休息已完成，恢复睡眠与课程节奏，让后续每周20小时能够持续

**完成后逐项验收**

- 四阶段分别有真实能力和限制说明
- 五个设备预约场景可指导第5周最小实现
- 复盘有一个错误的修复/回归证据及下次验证动作
- 实际时长已累计且完成30分钟离屏

**保留的学习产物**

- 阶段复盘与故障卡
- 第5周五场景/阻塞项清单

**问题排查**

- 复盘只列Go/MySQL等名词没有证据：给每项绑定一次命令、测试或提交，解释你独立做了什么以及哪里仍依赖帮助。
- 安装拖时后挤掉30分钟休息：到第一段结束就记未完，不继续安装；优先暂缓额外题和延伸，以总1200分钟重新排期。

**复盘问题**

- 现在能够从空目录独立复现通讯录哪几个环节？
- 下阶段真实认证与并发预约还缺哪两个可测试保证？

**可选延伸（从已有预算中调配时间）**

- 非必做：本任务不追加学习；想画更清晰的阶段图，只在30分钟复盘内替换一项整理。

## 第 5 周：开始实验室设备预约项目

目标：以实验室场景设计用户、设备与预约模型，做出可用的最小 API，并开始第一批投递。

### w05-t01 · 定义预约需求与项目结构（180 分钟）

操作：新建 lab-booking 仓库，定义用户、设备、时段、预约状态；约定学生预约与管理员管理两个角色，拆分 handler/service/store。验收：README 有 5 个用户场景、目录说明和明确暂不实现的功能，项目能返回 /health。

**学习目标：** 把已完成的通讯录经验迁移到独立预约项目；先确定可交付范围和请求路径，再写最小可运行骨架。

**开始前确认**

- 第4周通讯录能启动并连接学习MySQL
- 在WSL Ubuntu中以caolingyun操作，已有Go1.27.2/Git，无须重新安装
- 本周总预算20小时，先不开前端、短信和审批流程

**操作步骤**

1. **写出五个用户场景 · 35 分钟**

   - 分别写学生查设备、预约、查个人记录、取消，管理员启停设备的输入与结果
   - 约定单台设备同一时刻最多一条active预约，时段用左闭右开[start,end)
   - 选定UTC存储、RFC3339接口时间，展示时再转换Asia/Shanghai

2. **建立独立目录与仓库 · 25 分钟**

   - 确认lab-booking与contacts、TodoList并列，禁止在通讯录里另起模块
   - 为新项目初始化模块和Git，记录操作用户及当前路径
   - 写忽略规则排除.env、日志、cookie jar、二进制和真实数据

   ```text
   cd ~/projects
   mkdir -p lab-booking
   cd ~/projects/lab-booking
   go mod init lab-booking
   git init
   pwd
   ```

3. **画最小分层调用图 · 40 分钟**

   - 采用cmd/server及internal/handler、service、store，模型先放最方便共享的小文件
   - handler只解析HTTP，service执行时间/权限规则，store执行参数化SQL
   - 只为已出现的测试替身定义小接口，不先做通用仓储或复杂依赖注入

4. **实现健康检查骨架 · 50 分钟**

   - 从通讯录回忆ServeMux用法，自己写GET /health返回JSON
   - 监听127.0.0.1:8081，避免与通讯录8080冲突
   - 只连通启动与响应，暂不把未实现预约流程写为已完成

   ```text
   cd ~/projects/lab-booking
   go run ./cmd/server
   # 另开Ubuntu终端：
   cd ~/projects/lab-booking
   curl -i http://127.0.0.1:8081/health
   ```

5. **保存边界与本地提交 · 30 分钟**

   - README写五个场景、目录说明、启动命令和演示身份阶段
   - 把注册、前端、邮件提醒列入暂缓清单
   - 检查diff并作本地提交，远程推送由本人另行操作

   ```text
   cd ~/projects/lab-booking
   git status --short
   git diff
   git add README.md go.mod .gitignore cmd internal
   git commit -m 'start lab booking skeleton'
   ```

**完成后逐项验收**

- 五个场景都有成功和失败边界
- /health能返回200及application/json
- 能从handler讲到store的职责
- 项目路径与通讯录分离，暂缓项明确

**保留的学习产物**

- README需求与分层图
- 可运行骨架及本地提交

**问题排查**

- 在contacts下运行go mod init破坏原模块：先用pwd检查~/projects/lab-booking；已有go.mod时读取它，勿重复初始化。
- 为每层都写大量接口却还不能启动：先贯通/health，仅在测试需要替身的位置提取小接口，删除无调用的抽象。

**复盘问题**

- 为什么设备、时段、预约应区分为不同概念？
- 哪个暂缓功能最可能挤占20小时预算？

**参考资料**

- [李文周：Go Web 开发](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：Go Web 开发](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：用20分钟画更清晰的调用图，从本任务文档整理时间中调配，不增加周预算。

### w05-t02 · 设计 MySQL 表与迁移脚本（180 分钟）

操作：设计 users、devices、bookings，使用外键或明确的关联校验；保存可重复执行的迁移与演示数据脚本。验收：从空学习库可重建数据，能说明每张表的主键、时间字段和预约状态。

**学习目标：** 设计能解释关联、状态和时间边界的三张InnoDB表，把迁移、演示数据和应用权限分开。

**开始前确认**

- 预约采用左闭右开区间且时间策略已写定
- 第4周已有本机MySQL与受限应用账号，继续复用安装
- 只使用新学习库lab_booking_dev，不改contacts库

**操作步骤**

1. **列字段与约束 · 35 分钟**

   - users含主键、唯一登录名、password_hash、role，演示阶段哈希可暂为空且不能开放登录
   - devices含主键、名称、enabled；bookings含用户/设备外键、开始结束、active/cancelled
   - 声明开始早于结束由业务校验，若写CHECK须核对本机版本是否真正执行

2. **选择时间和关联语义 · 35 分钟**

   - 时间选DATETIME(6)存UTC约定，区别于自动时区转换的TIMESTAMP
   - 明确用户或设备已有预约时禁止物理删除，可改启停状态
   - 用外键约束孤儿记录，仍需服务层给未知设备友好404

3. **编写编号迁移 · 45 分钟**

   - 将建表放001_init.sql，按users/devices/bookings依赖顺序创建
   - 迁移重跑通过记录已执行版本来跳过，不能靠IF NOT EXISTS掩盖结构变更
   - 后续更改写新迁移；重建仅针对空的独立演示或测试库

   ```text
   cd ~/projects/lab-booking
   mkdir -p migrations scripts docs
   mysql -u '<学习库管理员>' -p -e 'SELECT VERSION();'
   mysql -u '<学习库管理员>' -p lab_booking_dev < migrations/001_init.sql
   ```

4. **准备最小种子与查询 · 40 分钟**

   - 种子含学生A、学生B、管理员及两台设备，演示标识绝不写真实身份信息
   - 用稳定唯一键检查演示数据是否已插入，重复运行不新增重复用户
   - 在独立练习库执行查询和状态更新，保存结果并解释foreign key失败

   ```text
   cd ~/projects/lab-booking
   mysql -u '<学习应用用户>' -p lab_booking_dev < scripts/seed_demo.sql
   mysql -u '<学习应用用户>' -p lab_booking_dev -e 'SHOW CREATE TABLE bookings;'
   ```

5. **审查索引与空库复现 · 25 分钟**

   - 先建bookings(device_id,status,start_at)及(user_id,start_at)等与查询一致的最少索引
   - 注明唯一(device_id,start,end)只拒绝完全相同值，不能阻止所有重叠区间
   - 从另一个空学习库验证迁移顺序，不删除现有数据

   ```text
   cd ~/projects/lab-booking
   git diff -- migrations scripts
   ```

**完成后逐项验收**

- 空独立库能按编号迁移建三表
- 种子重复运行后行数保持稳定
- 孤儿预约被约束阻止
- 能解释UTC、外键、索引及重叠约束的局限

**保留的学习产物**

- migrations与seed脚本
- 表关系图及字段说明
- 空库执行记录

**问题排查**

- 同样的SQL重跑报表已存在：区分首次迁移与版本管理；记录已执行版本，不把开发库DROP重建当升级步骤。
- 以唯一键代替时段排他规则：列出[10,12)与[11,13)反例，第7周用设备行锁与事务保证重叠排他。

**复盘问题**

- 外键存在时为什么仍要校验设备可用状态？
- DATETIME存UTC是数据库自动行为还是团队约定？

**参考资料**

- [李文周：MySQL](https://liwenzhou.com/posts/go/golang-menu/)
- [MySQL官方：外键约束（2026-10-12已打开核对）](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)
- [李文周：MySQL](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟比较两种索引顺序的EXPLAIN，替换本任务索引审查的一部分，不先追求性能数字。

### w05-t03 · 实现设备列表和预约 API（180 分钟）

操作：实现设备列表、创建预约和个人预约列表，校验起止时间、设备存在与预约人；先使用明确标注的本机演示身份。验收：curl 完成一个预约流程，错误时间和未知设备返回 400 或 404，README 说明演示身份的限制。

**学习目标：** 实现查设备、创建预约、查本人预约的最小闭环；本机演示身份仅用于业务联调，真实认证留到第6周替换。

**开始前确认**

- users/devices/bookings及演示种子可查询
- handler/service/store骨架能启动
- 知道database/sql的?占位参数与rows.Close、rows.Err

**操作步骤**

1. **先写接口契约 · 30 分钟**

   - 约定GET /devices、POST /bookings、GET /me/bookings字段和状态码
   - POST请求只含device_id/start_at/end_at，用户ID由服务端演示配置提供
   - 文档注明本周尚无真实登录、跨请求并发排他尚未实现

2. **实现设备查询 · 35 分钟**

   - 只查enabled设备且按ID稳定排序，空集合返回[]
   - 使用QueryContext及参数，不把客户端输入拼接进SQL
   - 关闭rows并检查迭代错误，store返回领域数据而非HTTP状态

   ```text
   cd ~/projects/lab-booking
   go test ./...
   curl -i http://127.0.0.1:8081/devices
   ```

3. **实现预约校验与插入 · 50 分钟**

   - 用RFC3339解析时间并归一UTC，拒绝start>=end、过去开始、未知或停用设备
   - 本机配置固定DEMO_USER_ID指向种子学生，仅绑定回环；不接受header/body伪造user_id
   - 先完成顺序请求规则，清楚记录并发缺口，创建返回201及新ID

4. **实现本人列表 · 35 分钟**

   - where user_id=?按服务端演示身份筛选，其他用户记录不能出现在列表中
   - 请求体设置大小上限，非法JSON与未知字段按统一约定处理
   - 构造成功、倒置时间、未知设备三个请求，保存为scripts/booking-demo.json等本机虚构数据文件后再执行curl；响应保留脱敏摘要。

   ```text
   cd ~/projects/lab-booking
   curl -i -H 'Content-Type: application/json' --data @scripts/booking-demo.json http://127.0.0.1:8081/bookings
   curl -i http://127.0.0.1:8081/me/bookings
   ```

5. **回归与记录缺口 · 30 分钟**

   - 用测试覆盖时间解析和空列表，重启后检查预约留在数据库
   - README标注演示身份开关与移除日期，不能对外部署这一模式
   - 把越权、重叠和重复提交问题列入第6/7周待验证清单

   ```text
   cd ~/projects/lab-booking
   go test ./...
   git diff
   ```

**完成后逐项验收**

- 顺序请求能完成列表→预约→本人记录
- 错误时间400、未知设备404
- 客户端user_id不能改变预约归属
- 重启后记录保留且演示限制醒目

**保留的学习产物**

- 三条API及curl记录
- 时间边界测试
- 演示身份与待验证清单

**问题排查**

- 客户端传user_id即被当成已登录用户：删除客户端身份入口，演示阶段只读本机配置，下一周换服务器查到的会话身份。
- 格式相同但时区不同的时间比较错误：解析为time.Time再比较并转UTC存储，不比较RFC3339原字符串。

**复盘问题**

- 演示身份为何不能证明认证安全？
- 一次创建预约分别在哪层检查时间、设备和SQL错误？

**参考资料**

- [李文周：HTTP 与数据库](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：HTTP 与数据库](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：用15分钟为设备列表加简单分页，从回归时间调配；先保证最小闭环可演示。

### w05-t04 · 统一错误、日志和 Context（180 分钟）

操作：统一 JSON 错误结构，给请求添加请求 ID 与耗时日志；把 context 传入数据库操作并设置超时。验收：一次失败请求可通过请求 ID 找到日志，取消请求后查询能结束，接口没有泄露密码或原始连接串。

**学习目标：** 让失败请求在客户端和日志中可关联，并把请求取消/超时传到SQL调用；对外只返回稳定错误码。

**开始前确认**

- 三条预约API已有成功与失败请求
- 知道context.Context及defer的基本用法
- 日志仅写到lab-booking练习目录，连接串已通过环境变量读取

**操作步骤**

1. **制定错误映射表 · 30 分钟**

   - 定义error.code/message/request_id，区分bad_request/not_found/conflict/internal
   - 用errors.Is或明确错误类型映射，禁止直接把数据库err.Error返回客户端
   - 约定5xx详细原因只进脱敏日志，正常列表为空不算错误

2. **实现请求日志中间件 · 40 分钟**

   - 生成服务端请求ID并返回X-Request-ID，若接收客户端ID则限制长度字符
   - 记录方法、路径模板、状态、耗时和请求ID，避免查询串携带秘密
   - 包装ResponseWriter记录首次WriteHeader与默认200，测试无显式WriteHeader情形
   - 创建logs目录后把开发服务标准输出/错误重定向到logs/dev.log；日志先脱敏且目录加入忽略，后续grep示例才有输入文件。

   ```text
   cd ~/projects/lab-booking
   mkdir -p logs
   go run ./cmd/server > logs/dev.log 2>&1
   ```

3. **贯通Context · 45 分钟**

   - handler取r.Context，service和store首参均接收ctx
   - 为SQL调用派生短超时并defer cancel，不把context.Background偷偷替换请求上下文
   - 使用QueryContext/ExecContext，区分客户端取消与数据库失败

4. **制造可控失败 · 40 分钟**

   - 向未知设备发请求并按request_id定位日志
   - 在独立练习查询中用短deadline验证超时，可用测试替身稳定验证传递
   - 记录取消是协作机制，驱动/数据库行为需实际验证，不能仅凭代码声称一定即时取消

   ```text
   cd ~/projects/lab-booking
   curl -i --max-time 1 http://127.0.0.1:8081/me/bookings
   grep -R '<待检查的request_id>' logs/dev.log
   go test ./... -run 'Context|Error|Log' -v
   ```

5. **检查敏感输出 · 25 分钟**

   - 检查密码、session、Cookie、Authorization及DSN都未进入日志与响应
   - 为错误响应写httptest，断言Content-Type、状态与JSON字段
   - 只保存脱敏例子和本次实测现象

   ```text
   cd ~/projects/lab-booking
   go test ./...
   grep -R -n -E 'password|cookie|authorization|dsn' docs logs
   ```

**完成后逐项验收**

- 一条失败请求能通过ID定位日志
- 非法输入与服务器故障状态不同
- SQL收到请求派生ctx且cancel被调用
- 响应和日志不泄露密码、token、DSN

**保留的学习产物**

- 错误结构与映射表
- 日志中间件测试
- 脱敏超时/取消记录

**问题排查**

- 超时配置存在但查询仍长期挂起：沿handler→service→store找断开的ctx；核对驱动支持，用可控慢查询记录实际取消时刻。
- 日志包装后状态总显示200：记录首个WriteHeader，Write前未设状态时按200处理，避免重复写头改变记录。

**复盘问题**

- 请求超时和数据库故障为何应有不同诊断？
- 哪些字段即使调试方便也不能写日志？

**参考资料**

- [李文周：Context 与日志](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：Context 与日志](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟为错误增加稳定领域类型，替换日志整理时间；不在本周引入日志平台。

### w05-t05 · Linux 环境变量与 DNS 请求流程（150 分钟）

操作：在 Shell 设置应用配置，用 printenv 检查非敏感变量；画出域名解析、TCP 建连、HTTP 请求的顺序，比较 localhost 与 IP。验收：能用 curl -v 解释一次请求连接到哪里，配置不硬编码在源码中。

**学习目标：** 看懂Shell配置如何进入Go进程，以及本机地址、DNS、TCP、HTTP的实际观测边界。保留可分享的观察，不打印当前Shell的敏感配置。

**开始前确认**

- 预约服务监听127.0.0.1:8081
- 在Ubuntu日常用户caolingyun终端操作
- 已有非敏感APP_ADDR与APP_ENV配置，密码不打印

**操作步骤**

1. **整理配置表 · 30 分钟**

   - 列APP_ADDR、APP_ENV、DB_DSN、演示开关的用途与默认值
   - 读取环境变量时区分未设置与空值，非法端口启动就报错
   - .env.example仅写占位内容，真实.env加入忽略规则
   - 不要用printenv或env无参数输出全部配置；DB_DSN即使只是学习密码也视作凭据，示例与真实值分开保存。

   ```text
   cd ~/projects/lab-booking
   export APP_ENV=local
   export APP_ADDR=127.0.0.1:8081
   printenv APP_ENV APP_ADDR
   ```

2. **验证子进程继承 · 35 分钟**

   - 在当前Shell启动服务，观察export后的值被程序读取
   - 另开终端说明环境并不会自动同步；改变变量后须重启进程
   - 禁用printenv全量输出，避免连接串进入截图与笔记

3. **比较localhost与IP · 30 分钟**

   - 分别对localhost和127.0.0.1调用/health，观察curl连接目标
   - 用getent查localhost解析，区分/etc/hosts与真正外部DNS请求
   - 解释localhost可含IPv6 ::1，而当前服务只监听IPv4回环

   ```text
   cd ~/projects/lab-booking
   getent hosts localhost
   curl -v http://localhost:8081/health
   curl -v http://127.0.0.1:8081/health
   ss -lntp
   ```

4. **画请求顺序 · 30 分钟**

   - 画地址解析→TCP连接→HTTP请求→handler→SQL→响应
   - 在图上标出本机curl不能直接证明TCP每个报文或DNS缓存情况
   - 用curl -v逐行对应已观测部分，不对登录接口使用详细日志

5. **保存一张定位卡 · 25 分钟**

   - 写连接被拒绝、域名未解析、服务返回500三种现象的下一步
   - 保存只含健康检查的脱敏终端记录
   - 核对源码里无硬编码DB密码、配置示例可交给别人填

   ```text
   cd ~/projects/lab-booking
   grep -R -n -E 'APP_ADDR|APP_ENV|DB_DSN' cmd internal .env.example
   git check-ignore .env
   ```

**完成后逐项验收**

- 知道export影响当前Shell后续子进程
- 能指出curl连接的IP与端口
- 不会把localhost查询等同外部DNS实验
- 配置表与示例不含真实密码

**保留的学习产物**

- 配置表及.env.example
- 请求流程图
- 三种现象定位卡

**问题排查**

- 设置APP_ADDR后已有服务端口没有变化：环境在进程启动时读取；停止自己启动的服务，再在同一Shell重新运行。
- localhost访问失败而127.0.0.1可用：检查curl实际用::1还是IPv4和ss监听地址，不盲目开放0.0.0.0。

**复盘问题**

- 环境变量在父进程和子进程间如何传递？
- curl -v能看见TLS或TCP的哪些部分，哪些看不见？

**参考资料**

- [缺失的一课：命令行环境](https://missing-semester-cn.github.io/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [缺失的一课：命令行环境](https://missing-semester-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟只对公开非敏感域名运行getent并记录解析结果，调配流程图时间，不增加网络工具安装。

### w05-t06 · 树的遍历与递归（150 分钟）

操作：用 Go 定义二叉树节点，实现前序遍历与最大深度；手画递归调用栈，并覆盖空树和单节点。验收：2 道题独立完成，能解释递归终止条件和时间、空间复杂度。

**学习目标：** 用两道树题掌握递归终止、返回值组合和栈深度；算法练习与预约代码分开存放。

**开始前确认**

- 已理解Go结构体、指针、切片及函数
- 约定nil表示空节点，树不含环
- 本任务150分钟，到时保留未解卡点而非复制整份答案

**操作步骤**

1. **定义节点并画例子 · 25 分钟**

   - 在练习包写Node{Val,Left,Right}并构造3层不平衡树
   - 画空树、单节点、仅左链三个输入的形状
   - 先写前序结果与最大深度，约定空树深度0、根节点深度1

2. **手算前序递归 · 35 分钟**

   - 用根→左→右记录访问次序，手画调用返回栈
   - 实现遍历时注意结果切片共享方式，避免每次递归重置
   - 用空树先验证终止，不把访问值相同的不同节点去重

3. **实现最大深度 · 35 分钟**

   - 先用语言写1+max(leftDepth,rightDepth)再编码
   - 逐个标注子问题返回值，而非依赖全局计数器
   - 检查链状树递归深度O(n)，平衡树为O(log n)，访问时间O(n)
   - 空孩子返回0是递归组合的基础，用左右子树深度不同的例子核对max而非相加。

4. **写表驱动测试 · 30 分钟**

   - 覆盖空树、单节点、满二层和偏斜链，两题共用输入定义
   - 核对结果值和顺序，前序空结果[]或nil约定要一致
   - 暂用较小树验证，超深链风险写进限制

   ```text
   cd ~/projects/lab-booking
   mkdir -p exercises/tree
   go test ./exercises/tree -v
   ```

5. **口述与错题记录 · 25 分钟**

   - 关掉解答重写递归终止条件与返回语句
   - 记录一次切片未返回或深度差一的真实问题
   - 将树题与真实设备列表区别写一句，避免为了算法给业务造无用树

   ```text
   cd ~/projects/lab-booking
   go test ./exercises/tree -count=1
   ```

**完成后逐项验收**

- 前序次序与手算一致
- 最大深度覆盖nil、单节点、偏斜树
- 能解释O(n)时间与O(h)递归栈
- 两题保留自己的测试和修改记录

**保留的学习产物**

- 树题源码与测试
- 调用栈图
- 复杂度及错题笔记

**问题排查**

- 结果切片递归后没有增加：append可能产生新切片；选择显式返回结果或传结果指针，并用多节点验证。
- 单节点深度被算成0或2：统一nil深度0，每个非nil节点只加1，沿单链手算定位。

**复盘问题**

- 什么时候递归额外空间是O(log n)，什么时候是O(n)？
- 全局变量版本会给并行测试带来什么问题？

**参考资料**

- [Go by Example：递归](https://gobyexample-cn.github.io/)
- [Go by Example：递归](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟用显式栈重写前序，与复盘时间调配；不必同时学树的所有变体。

### w05-t07 · 准备第一版简历并投递 3–5 个岗位（120 分钟）

操作：写一页简历，列通讯录真实已完成功能、课程与 GitHub；说明研一在读、宜昌所在地、可到岗日期及每周出勤条件，投递 3–5 个匹配岗位。验收：保存简历和投递表，未实现的预约功能与未经测量的性能不写作成绩。

**学习目标：** 用通讯录真实成果写一页简历，开始少量定向投递并记录可到岗条件；预约项目仅写正在开发。

**开始前确认**

- 第4周通讯录有README、API及测试证据
- 本人确认研究生课程、导师安排、城市与时间条件
- 第4周岗位表可用，岗位是否开放须在官方招聘入口当次核验

**操作步骤**

1. **盘点可证明内容 · 25 分钟**

   - 列C/Python基础、研一专业课程、通讯录HTTP/MySQL/测试的证据路径
   - 预约项目只注明当前已实现的API及在建状态，不写尚无认证和并发保证
   - 删除熟练掌握、生产级、高并发等无法证明的词

2. **写一页简历 · 35 分钟**

   - 组织教育、技能、项目、联系方式四块，用具体动作描述自己的改动
   - 写宜昌所在地、预计可到岗日期、每周出勤天数和持续月数，未知项标待确认
   - GitHub链接由本人核对可访问，区分AI示范与自己理解修改的部分

3. **筛选并投递 · 40 分钟**

   - 在第4周保存的企业招聘官网逐个确认职责、城市、研究生资格和实习时长
   - 选北上广深杭中本人可接受且条件匹配的3–5个机会，按入口由本人提交
   - 岗位停止招聘或找不到合适项则记录事实及替代筛选，不虚构实时岗位与申请

4. **记录下一步 · 20 分钟**

   - 投递表写公司、职位、城市、官方入口、日期、状态及下一次核查日
   - 留10分钟练习从通讯录一次请求讲到参数化SQL
   - 保存简历脱敏版，真实联系方式和投递附件不进公开仓库

   ```text
   cd ~/projects/lab-booking
   git status --short
   git diff -- README.md docs
   ```

**完成后逐项验收**

- 一页简历每条项目成绩有代码或测试支撑
- 到岗与出勤条件真实且待确认项标注
- 本人投递3–5个或如实记录不足原因
- 投递表有日期、入口和下一步

**保留的学习产物**

- 一页简历及脱敏版
- 投递跟踪表
- 两分钟通讯录介绍提纲

**问题排查**

- 把预约待实现功能写成已完成亮点：给每条描述绑定提交/演示证据，缺少证据就降为在建目标。
- 岗位写长期实习但课程不允许：核对出勤及起止月份，先筛除明显不符项，再在后续流程确认安排。

**复盘问题**

- 哪些已完成任务最能证明你可独立排错？
- 没有回复时下一轮怎样改变岗位匹配与表达？

**参考资料**

- [字节跳动校园招聘官方入口（2026-10-12已打开，仅供当次核验岗位）](https://jobs.bytedance.com/campus/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟请同学读脱敏简历，替换介绍练习；投递不承诺拿到面试或录用。

### w05-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟复盘预约模型与投递反馈，选择下周必须解决的权限问题；30 分钟离屏活动。验收：记录 1 个设计问题、1 个求职问题和实际时长，保持总投入在 20 小时内。

**学习目标：** 把预约模型和首轮投递中的真实卡点转成下周两个优先事项，并完整留出离屏恢复时间。复盘的目的在于校准难度与证据，不是补做整周工作；有遗漏便选最小阻塞项重新排期，并明确放弃本周可选延伸。

**开始前确认**

- 保存本周完成/未完成任务与实际分钟
- 有预约README、演示请求和投递表
- 每周1200分钟含此60分钟，不额外补延伸任务

**操作步骤**

1. **有证据的周复盘 · 30 分钟**

   - 用前10分钟回看五个场景和三条API，写一个设计问题及目前证据
   - 用中间10分钟看投递条件、状态与一个求职问题，不以回复数量判断能力
   - 最后10分钟累计实际时长，列第6周认证替换/权限矩阵等最多三项；超预算先暂停非必做内容
   - 复盘输出只保留能带来下一步动作的事实：用“现象→证据文件/命令→仍不确定点→下次验证”写一小段；若某功能未完成就标未完成，不为勾选任务改写结论。

2. **离屏休息 · 30 分钟**

   - 停止编辑器与终端，散步或轻度伸展，不边走边看教程
   - 整理肩颈与睡眠安排，允许自己不继续调试未完成问题
   - 到时只记休息已完成，所有新增想法留到下周再处理
   - 休息时不接着看录屏或岗位页面；可以喝水、走动和放松眼睛，让下一周仍有持续投入的精力。

**完成后逐项验收**

- 留下至少5句含证据的复盘，其中至少一句注明尚未验证的限制，另有一句写下一次可执行的验证步骤。
- 记录一个设计问题及一个求职问题
- 下一周优先级不超过三项且预算仍20小时
- 实际完成30分钟离屏

**保留的学习产物**

- 本周复盘与时长表
- 下周优先项清单

**问题排查**

- 复盘变成继续写功能导致休息取消：设两个30分钟计时段，到第一段结束只记录未完，不再打开编码任务。
- 因没有面试回复认定计划失败：把可控项拆为匹配、简历证据、投递日期，招聘反馈如实记录，不推断个人能力结论。

**复盘问题**

- 真实登录上线前必须移除哪个演示入口？
- 下周哪项任务可以缩小以维持20小时？

**可选延伸（从已有预算中调配时间）**

- 非必做：不为本任务追加学习时间；若要整理图示，只在30分钟复盘段内替换一项记录。

## 第 6 周：完善登录与预约权限

目标：让用户只能操作自己的预约，管理员可管理设备，形成有权限边界的完整流程。

### w06-t01 · 实现登录与会话（180 分钟）

操作：在预约项目中使用成熟密码哈希库实现账号登录，生成随机会话令牌并设置过期时间；拒绝把密码以明文保存。验收：正确密码可登录，错误密码失败，过期或缺失会话返回 401；能说明哈希与加密的差别。

**学习目标：** 用官方bcrypt库验证密码，用密码学随机token建立服务器会话；从本机演示身份过渡到真实账号认证。

**开始前确认**

- 第5周三表与API可用，用户种子仍是演示身份
- 先阅读下方bcrypt与crypto/rand当前官方API
- 仅在127.0.0.1本机HTTP练习，账号用虚构用户名和测试密码

**操作步骤**

1. **准备哈希与测试账号 · 35 分钟**

   - 阅读GenerateFromPassword与CompareHashAndPassword签名，使用bcrypt.DefaultCost起步并记录本机成本
   - 用一次性本机种子工具读取交互式测试密码生成hash，数据库只存password_hash
   - 校验密码非空且不超过72字节，不是72个汉字；禁止明文、裸SHA256或自己写哈希算法

   ```text
   cd ~/projects/lab-booking
   go get golang.org/x/crypto@'<核验兼容Go1.27.2的版本>'
   go doc golang.org/x/crypto/bcrypt
   ```

2. **实现登录验证 · 40 分钟**

   - POST /login限制请求体，按参数化查询读取账号及哈希
   - 用CompareHashAndPassword判断，用户名不存在和密码错统一401消息
   - 登录成功才创建会话；先编写scripts/login-local.json含虚构账号与本机测试密码，加入.gitignore后才执行curl，真实密码不进命令行参数。

3. **生成和保存会话 · 40 分钟**

   - 使用crypto/rand.Read生成32字节随机值并base64url编码，不用math/rand、时间戳或用户ID
   - 建sessions表保存token的SHA256摘要、user_id和expires_at，令牌原值只交给客户端
   - 会话验证先查摘要及到期时间再加载用户，认证身份不读header/body user_id

4. **设置Cookie与退出 · 35 分钟**

   - Set-Cookie使用HttpOnly、SameSite=Lax、Path=/并设置到期；本机HTTP例外不设Secure，对外HTTPS必须设Secure
   - 退出时删除服务端会话并用同路径过期Cookie清理客户端
   - 替换演示身份中间件并默认彻底关闭DEMO_USER_ID，不同时留后门路径

   ```text
   cd ~/projects/lab-booking
   curl -i -c /tmp/lab-cookie-a.txt -H 'Content-Type: application/json' --data @scripts/login-local.json http://127.0.0.1:8081/login
   ```

5. **验证失败与生命周期 · 30 分钟**

   - 测试正确/错误密码、缺失/伪造/过期会话和退出后复用旧token
   - 检查响应只含必要用户资料，没有hash和token摘要
   - Cookie jar视同凭据，加入忽略且不截图、不随日志提交

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'Login|Session' -v
   curl -i -b /tmp/lab-cookie-a.txt http://127.0.0.1:8081/me/bookings
   ```

**完成后逐项验收**

- 正确密码登录，错误/空密码失败
- 缺失、伪造、过期会话均401
- 退出后旧会话失效
- DB无明文密码且演示身份不再绕过认证

**保留的学习产物**

- 登录/退出与会话迁移
- 认证生命周期测试
- Cookie与凭据处理说明

**问题排查**

- 直接比较新生成hash与数据库hash总失败：bcrypt每次含随机盐；验证调用CompareHashAndPassword，不重新生成后字符串比较。
- 中文长密码被意外截断或登录不一致：按UTF-8字节检查72字节上限并明确报输入错误，不截断、不做未说明的预哈希。

**复盘问题**

- 密码hash为何无需解密便能验证？
- 偷到有效Cookie的风险与猜用户ID有什么差别？

**参考资料**

- [李文周：Go Web 学习条目](https://liwenzhou.com/posts/go/golang-menu/)
- [Go bcrypt 官方 API（2026-10-12 已核对）](https://pkg.go.dev/golang.org/x/crypto/bcrypt)
- [Go crypto/rand（2026-10-12 已核对）](https://pkg.go.dev/crypto/rand)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：Go Web 学习条目](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟测一次bcrypt成本，从生命周期测试整理时间调配；注册、找回密码与复杂JWT不在本周范围。

### w06-t02 · 实现角色与预约归属校验（180 分钟）

操作：为管理设备接口检查管理员角色，为查询与取消预约检查 owner；以服务端会话身份确定用户，忽略客户端伪造身份。验收：学生不能管理设备，A 用户不能取消 B 用户预约，分别返回 403 或符合接口约定的 404。

**学习目标：** 将认证得到的服务器身份用于角色和归属判断，用清晰权限矩阵防止学生管理设备或操作他人预约。

**开始前确认**

- 登录中间件能从会话取用户ID与角色
- 客户端提交的role/user_id均不可信
- 两名学生A/B、一个管理员及各自预约已在独立学习库准备

**操作步骤**

1. **先画权限矩阵 · 35 分钟**

   - 列未登录、本人、其他学生、管理员四类，列列表/创建/取消/设备启停操作
   - 决定管理员是否也能取消他人预约；本计划默认不能，管理权限只针对设备
   - 未登录401，权限不足403；为隐藏资源存在可统一归属失败404，但必须契约一致

2. **传递认证主体 · 30 分钟**

   - 中间件验证会话后以受控context键传Principal{ID,Role}
   - handler取主体传给service，不让DTO含可直接信任的user_id/role
   - 删除本机演示身份入口并写测试，带假ID/header仍按真实会话判断

3. **实现管理员设备操作 · 40 分钟**

   - POST/PATCH设备启停先验证admin，再校验设备ID和合法enabled值
   - 角色来源为数据库用户记录，不能让客户端请求体声明admin
   - 拒绝非管理员时不得先修改数据库，检查执行顺序
   - 将启停示例体保存为scripts/device-disable.json，仅含enabled:false；确认种子设备ID后再替换URL中的1。

4. **实现归属过滤 · 45 分钟**

   - 本人列表SQL带user_id=?；取消定位用booking_id与真实user_id共同筛选
   - 按约定返回404隐藏他人预约，管理员也不能绕过默认归属规则
   - store返回状态由service决定领域错误，handler统一映射状态

   ```text
   cd ~/projects/lab-booking
   curl -i -b /tmp/lab-cookie-a.txt -X PATCH -H 'Content-Type: application/json' --data @scripts/device-disable.json http://127.0.0.1:8081/devices/1
   curl -i -b /tmp/lab-cookie-a.txt -X POST http://127.0.0.1:8081/bookings/2/cancel
   ```

5. **保存失败证据 · 30 分钟**

   - 比较A操作B、管理员启停、未登录三类响应与数据库状态
   - 确认拒绝后无数据变化，不能仅断言HTTP状态
   - README记录权限矩阵和管理员种子创建路径，禁止公开自助升级角色

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'Owner|Role|Permission' -v
   ```

**完成后逐项验收**

- 学生管理设备403且数据未变
- A取消B返回约定404且B记录仍active
- 未登录受保护接口401
- 伪造user_id/role不改变主体

**保留的学习产物**

- 权限矩阵与接口契约
- 角色/归属实现
- 越权响应及数据断言记录

**问题排查**

- 先按ID更新再检查owner导致越权：将归属检查放到更新前并纳入SQL条件；更新失败时保持数据不变。
- 管理员角色从前端隐藏按钮推断：服务端每个管理入口检查已认证主体角色；前端展示不构成授权。

**复盘问题**

- 为什么知道booking_id不代表有取消权限？
- 管理员有哪些能力是业务明确授予的，而非角色名默认包含的？

**参考资料**

- [李文周：HTTP 中间件与 Web 开发](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：HTTP 中间件与 Web 开发](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟给权限矩阵补查询他人记录的否定测试，替换失败证据整理；不引入复杂RBAC框架。

### w06-t03 · 完成预约取消与状态变化（180 分钟）

操作：实现取消预约、设备启停与可预约设备筛选；明确 active、cancelled 的状态变化和重复取消行为。验收：演示登录→查询设备→预约→查询个人记录→取消全流程，停用设备无法新建预约。

**学习目标：** 完成预约取消和设备启停的状态规则，让登录用户能走完整流程，并为第7周事务加锁定义一致入口。

**开始前确认**

- 会话认证及角色/归属规则已实现
- bookings只采用active与cancelled两个状态
- 同一设备可预约与启停规则需写入README

**操作步骤**

1. **写状态转移表 · 30 分钟**

   - 允许active→cancelled，重复取消返回幂等成功但不再次写取消时间
   - 不可cancelled→active；重新预约创建新记录而非复活旧记录
   - 停用设备阻止新的预约，已有active记录本周保留且可本人取消，避免暗中批量删除

2. **实现本人取消 · 45 分钟**

   - 用真实会话身份+booking_id定位记录，未知/他人按404约定
   - UPDATE带status='active'和user_id条件，记录一次cancelled_at
   - RowsAffected为0时区分已取消与无归属，不能把所有情况当成功

3. **实现启停与筛选 · 35 分钟**

   - 管理员可变更enabled，GET /devices默认过滤停用
   - 创建预约在服务端再次校验enabled，不能依赖客户端列表
   - 本周注明启停与创建并发尚待第7周共同锁设备行，避免声称已安全

4. **走完整用户流程 · 40 分钟**

   - 使用A的cookie jar依次列表→创建→本人查询→取消→再查
   - 管理员停用后A预约应失败；重新启用后可预约
   - 用独立演示数据重复取消两次，核对状态与cancelled_at不被覆盖

   ```text
   cd ~/projects/lab-booking
   curl -i -b /tmp/lab-cookie-a.txt http://127.0.0.1:8081/me/bookings
   curl -i -b /tmp/lab-cookie-a.txt -X POST http://127.0.0.1:8081/bookings/1/cancel
   ```

5. **补状态回归 · 30 分钟**

   - 为重复取消、取消他人、停用后创建、取消后列表各写用例
   - 保存前后行状态，避免只截图成功响应
   - 将开始后是否可取消等未实现业务选择写成限制，不让它变成隐藏歧义

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'Cancel|DeviceEnabled|State' -v
   ```

**完成后逐项验收**

- 登录→预约→取消可连贯演示
- 重复取消符合幂等契约
- 停用设备不能新建预约
- 取消他人和未知ID无数据变化

**保留的学习产物**

- 状态转移表
- 取消及设备启停接口
- 完整流程及回归记录

**问题排查**

- 重复取消更新了原取消时间：UPDATE仅作用active记录，已cancelled时读取后按既定幂等结果返回。
- 只过滤列表但POST仍可预约停用设备：创建时在服务端检查enabled，第7周把检查放入锁定设备后的事务。

**复盘问题**

- 停用设备是否应该自动取消已有预约，为什么？
- 幂等取消与重复创建为何不能采用同一处理方式？

**参考资料**

- [李文周：Go 与 MySQL](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：Go 与 MySQL](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟讨论开始后取消规则，替换状态文档整理；本周不做审批、通知或恢复预约。

### w06-t04 · 用表驱动测试覆盖权限矩阵（180 分钟）

操作：为未登录、本人、其他学生、管理员写 API 测试；增加恶意身份字段、空密码、会话过期等边界。验收：至少 8 个权限用例通过，go test ./... 与 go test -race ./... 通过，能解释每个 401 和 403。

**学习目标：** 把权限矩阵变成可运行的表驱动API测试，验证拒绝响应及数据库未变化；识别覆盖范围的真实边界。

**开始前确认**

- 登录、角色、归属和取消可手动演示
- 知道httptest与表驱动testing基础
- 测试数据使用独立库或存储替身，不连接个人学习数据

**操作步骤**

1. **列权限用例 · 30 分钟**

   - 至少列未登录查本人、过期会话、本人取消、A取消B、学生启停、管理员启停八例
   - 增加伪造user_id、伪造role、空密码、错误密码等输入
   - 每条明确准备数据、请求、状态码和操作后数据期望

2. **构建最小测试夹具 · 40 分钟**

   - 用httptest.NewRecorder与NewRequest测handler，需要Cookie流程时用NewServer
   - 服务层仅提取身份/存储所需小接口，别为测试重写整个架构
   - 为A/B/admin创建确定性测试数据，会话expiry用可控now函数避免真实sleep

3. **实现表驱动断言 · 45 分钟**

   - 每例独立安排数据、发送请求、解JSON并核对code
   - 权限失败同时断言设备enabled或booking.status没有改变
   - 验证恶意user_id不能使A创建归属B，管理员取消他人按矩阵结果

4. **检查共享测试状态 · 35 分钟**

   - 避免多个t.Parallel共享同一session map或同一数据库行
   - 内存替身使用同步保护，结束时关闭httptest服务器与响应body
   - 发现失败先保存最小复现再修，不删掉暴露bug的用例

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'Permission|Login|Session' -count=1 -v
   go test -race ./...
   ```

5. **写覆盖边界 · 30 分钟**

   - 保存测试命令和实际输出，不只报一个覆盖率百分比
   - 注明SQL锁/并发排他尚在第7周集成测，HTTP单测不代表数据库正确
   - 挑一条401与一条403解释认证和授权差别

   ```text
   cd ~/projects/lab-booking
   go test ./...
   git diff -- '*_test.go'
   ```

**完成后逐项验收**

- 至少8条权限用例可独立通过
- go test与race在实际环境通过或记录真实失败
- 越权拒绝有数据未变断言
- 能解释测试替身未覆盖的SQL行为

**保留的学习产物**

- 权限表驱动测试
- 真实bug复现及修复记录
- 检查结果与范围说明

**问题排查**

- 测试相互影响导致单跑过整套失败：每例重建夹具，隔离库或数据ID，禁止共享未重置会话与预约行。
- 用sleep等会话过期使测试缓慢不稳定：注入now或构造已过期expiry，用边界时间验证，无须等待墙钟。

**复盘问题**

- 某条403响应正确但数据已改，测试如何发现？
- 通过race为何不能证明预约区间无业务冲突？

**参考资料**

- [李文周：单元测试](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：单元测试](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟统计业务路径覆盖，从范围整理中调配；本周不追求任意百分比目标。

### w06-t05 · HTTP Cookie、HTTPS 与 Linux curl（150 分钟）

操作：用 curl 的 cookie jar 登录和访问受保护接口，阅读 Set-Cookie；画出 HTTP 明文与 TLS 保护的范围，检查日志是否含敏感字段。验收：能解释 Cookie、会话、认证、授权四者关系，本机演示使用测试密码。

**学习目标：** 用curl Cookie jar观察会话携带和失效，并讲清Cookie属性、HTTP明文与TLS保护范围。

**开始前确认**

- 登录与退出API已有会话过期检查
- 虚构本机账号，不用学校或个人常用密码
- 仅健康检查可公开记录curl -v；登录输出须防token泄露

**操作步骤**

1. **安全准备Cookie jar · 25 分钟**

   - 在/tmp创建只由当前用户可读的jar，视为凭据
   - 登录JSON文件不进Git，示例只有占位密码；不把密码放curl参数文本
   - 从登录响应确认属性时手动遮盖token，完整头不要贴到公开笔记

   ```text
   cd ~/projects/lab-booking
   umask 077
   curl -sS -c /tmp/lab-cookie-a.txt -H 'Content-Type: application/json' --data @scripts/login-local.json http://127.0.0.1:8081/login
   ```

2. **验证Cookie自动携带 · 35 分钟**

   - 使用-b jar查/me/bookings，再不用jar比较401
   - 解释jar保存token，服务器用token找会话，角色仍在服务端判断
   - 退出后用旧jar再请求，确认服务端撤销而非仅客户端删除

   ```text
   cd ~/projects/lab-booking
   curl -i -b /tmp/lab-cookie-a.txt http://127.0.0.1:8081/me/bookings
   curl -i http://127.0.0.1:8081/me/bookings
   ```

3. **逐项解释属性 · 35 分钟**

   - 说明HttpOnly限制脚本读Cookie、Secure仅经HTTPS发送、SameSite缓解部分跨站请求
   - 本机HTTP暂不设Secure是演示例外，对外须HTTPS并设Secure
   - Cookie认证的状态变更接口仍需CSRF考虑，可用Origin校验/成熟CSRF机制；SameSite不是完整防线

4. **画TLS边界 · 30 分钟**

   - 画客户端→TLS终止点→应用→数据库，标出HTTPS保护的网络段
   - 说明TLS不替代密码哈希、认证或授权，日志仍可能泄密
   - 观察公开HTTPS健康请求握手摘要，限制为概念理解，本周不部署证书服务

5. **审查可分享记录 · 25 分钟**

   - 清理演示截图里的Cookie、Authorization、密码与DSN
   - 检查退出流程和Cookie Path一致，保存脱敏成功/401例子
   - 写认证、授权、会话、Cookie四个短定义并绑定自己的接口
   - 终端记录只保存脱敏摘要，Cookie jar虽是文本文件也不能当普通作业附件分享。

   ```text
   cd ~/projects/lab-booking
   git status --short
   git check-ignore scripts/login-local.json
   grep -R -n -E 'Cookie|Authorization|password' docs
   ```

**完成后逐项验收**

- 带jar可访问，不带jar401
- 退出后旧会话失效
- 能解释三项属性及本机Secure例外
- 能指出HTTPS保护范围与CSRF边界

**保留的学习产物**

- 脱敏Cookie流程记录
- TLS保护范围图
- 凭据日志审查清单

**问题排查**

- 设置Secure后本机HTTP始终401：curl不会在HTTP正常发送Secure Cookie；仅本机演示显式配置例外，对外HTTPS必须开启。
- 退出只删浏览器Cookie而旧token还能用：同步撤销服务器sessions记录，再清理同名同Path Cookie，测试复用旧token。

**复盘问题**

- Cookie本身如何证明用户身份，还是服务器会话证明？
- HttpOnly能否防止所有跨站请求与账号滥用？

**参考资料**

- [李文周：HTTP 与网络编程](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：HTTP 与网络编程](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟补Origin拒绝测试，替换图示整理；不在本任务临时引入外网部署。

### w06-t06 · 滑动窗口与字符串练习（150 分钟）

操作：用 Go 实现最长无重复子串和固定窗口最大和，先用朴素方法再改进。验收：解释窗口何时扩展、收缩，覆盖重复字符、空输入和窗口超过数组长度。

**学习目标：** 用滑动窗口维护可验证的不变量，区分字节和Unicode字符，并处理负数与非法窗口大小。

**开始前确认**

- 能用Go map计数和切片遍历
- 两题先写朴素解作为小输入对照
- 练习包与预约服务业务代码分开

**操作步骤**

1. **明确输入语义 · 25 分钟**

   - 最长无重复子串约定按rune字符计数，先把字符串转[]rune
   - 固定窗口最大和输入整数切片与k，k<=0或k>len返回明确错误
   - 准备空、全重复、中文与全负数例子，手算答案

2. **先写朴素对照 · 30 分钟**

   - 对子串枚举起点并用集合探查重复，窗口和枚举每个合法窗口
   - 保存小输入正确性作为改进对照，不追求大数据运行
   - 写出时间复杂度和为何重复计算

3. **实现可变窗口 · 40 分钟**

   - 左边界只向右移动，map记录字符最近位置，遇重复用max(left,last+1)
   - 每步记录窗口内无重复的不变量，用abba检验不能把left倒退
   - 最大长度以rune索引差计算，不用UTF-8字节下标代替
   - map保存的是rune序列下标而非字符串字节位置，混用时中文用例会暴露长度错误。

4. **实现固定窗口 · 30 分钟**

   - 累加前k项后每次移出左端移入右端，窗口长度始终为k
   - 最大和初始化为首个窗口，不能初始化0忽略全负数
   - 对每个边界与朴素解比较，并注明int溢出的输入范围

   ```text
   cd ~/projects/lab-booking
   mkdir -p exercises/window
   go test ./exercises/window -v
   ```

5. **独立口述与复查 · 25 分钟**

   - 关掉代码手演abba与[-5,-2,-3],k=2
   - 比较可变窗口收缩条件和固定窗口移动条件
   - 记录一个真实边界bug及修复测试，超时则保留卡点

   ```text
   cd ~/projects/lab-booking
   go test ./exercises/window -count=1
   ```

**完成后逐项验收**

- 空串/中文/abba结果正确
- 全负数窗口和正确
- 非法k有明确行为
- 能解释两题O(n)扫描及额外空间

**保留的学习产物**

- 两题与朴素对照源码
- 表驱动边界测试
- 窗口不变量笔记

**问题排查**

- abba得到3因为左指针回退：left只能单调前进；重复位置在旧窗口外时不能收缩当前窗口。
- 全负数数组最大和返回0：以首个合法窗口和初始化best，不设无依据的0。

**复盘问题**

- 字节索引与字符索引何时可以等价？
- 为什么滑动窗口的两个指针各前进n次仍是O(n)？

**参考资料**

- [Go by Example：Map 与切片](https://gobyexample-cn.github.io/)
- [Go by Example：Map 与切片](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟生成小数组与朴素解交叉验证，替换口述整理，不继续增加新题。

### w06-t07 · 更新项目证据并持续投递（120 分钟）

操作：把真实已实现的登录、角色与测试写入简历，推送代码；跟进前次申请并新投 5 个匹配岗位，优先可接受研究生实习时长的岗位。验收：投递表记录入口、日期、反馈和下一步，准备 2 分钟项目介绍。

**学习目标：** 把已经验证的登录与权限写成可追溯项目证据，更新简历并保持小批量投递及反馈记录。

**开始前确认**

- 登录/权限矩阵及测试实际跑过
- 本人已确认到岗与出勤条件，首轮表已建立
- 只更新事实，预约并发安全尚未完成

**操作步骤**

1. **整理可展示证据 · 25 分钟**

   - 给登录、归属和管理员设备操作各选择一段脱敏响应或测试
   - README加权限矩阵、本机HTTP例外、会话过期及演示身份已移除说明
   - 本地审查diff与提交；本人需要时自行推送，计划编写不执行推送

   ```text
   cd ~/projects/lab-booking
   git diff
   git status --short
   go test ./...
   ```

2. **更新简历与提纲 · 30 分钟**

   - 仅加入已实现的哈希验证、随机会话与权限测试，避免写安全完备
   - 用项目描述解释为何不信客户端user_id，注明学习项目
   - 写2分钟介绍：需求→三层→认证→一次越权测试

3. **核验岗位并投递 · 40 分钟**

   - 从企业官方招聘入口查5个与Go/后端基础匹配且仍开放岗位
   - 优先核对研究生资格、每周天数和连续月份，选择本人能赴的城市
   - 由本人提交申请或跟进已有流程，缺少机会时记录原因，不补虚构条目

4. **记录反馈与待改项 · 25 分钟**

   - 表中保留日期、入口、状态、下一步；无回复也用事实状态表示
   - 挑一个岗位反复出现的要求与现有项目差距，放下周候选
   - 录两分钟介绍并回听一句不够准确的技术表述

   ```text
   cd ~/projects/lab-booking
   git log -5 --oneline
   ```

**完成后逐项验收**

- 简历新增功能都有测试或提交证据
- 简介能分清认证和授权
- 本人新增5个匹配申请或记录实际不足
- 投递状态与下一步更新

**保留的学习产物**

- 更新简历与证据索引
- 投递跟踪表
- 两分钟介绍及改进句

**问题排查**

- 简历把随机session写成JWT：确认项目实际方案是服务器会话，使用准确名称，不借术语增加复杂度。
- 只追求投递数量忽视实习时长：筛选时先核对研究生、连续月份和每周天数，排除明显不符再提交。

**复盘问题**

- 哪项权限测试最能支撑你的项目描述？
- 岗位要求的哪些能力已经有证据，哪些仍是学习目标？

**参考资料**

- [字节跳动校园招聘官方入口（2026-10-12已打开，仅供当次核验岗位）](https://jobs.bytedance.com/campus/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟向同学演练简介，调配反馈复盘时间；没有回复不等于可以承诺下一周有面试。

### w06-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟从客户端到服务端讲清一次权限判断，复盘一个错误；30 分钟散步或伸展。验收：记录权限矩阵、实际时长与下周并发预约的待验证问题。

**学习目标：** 用一条真实请求讲清认证与授权，保留修复证据并提出下周要用数据库验证的竞争问题。复盘的目的在于校准难度与证据，不是补做整周工作；有遗漏便选最小阻塞项重新排期，并明确放弃本周可选延伸。以真实完成度调整计划。

**开始前确认**

- 保存登录/权限测试与一条真实bug
- 本周投递表与实际分钟齐全
- 复盘和离屏各30分钟，计入20小时

**操作步骤**

1. **权限链条复盘 · 30 分钟**

   - 前10分钟从Cookie→session→Principal→owner/role→SQL画一条链，标出每步信任来源
   - 中间10分钟回看一个越权或会话bug，写错误假设、修复和对应测试
   - 最后10分钟累计时长，问同一设备同一时段十人同时创建会发生什么，写可测猜想而非安全结论
   - 复盘输出只保留能带来下一步动作的事实：用“现象→证据文件/命令→仍不确定点→下次验证”写一小段；若某功能未完成就标未完成，不为勾选任务改写结论。

2. **主动离屏 · 30 分钟**

   - 离开编辑器和手机教程，散步或轻度伸展
   - 允许未完权限项进入下周待办，先减少延伸而非挤休息
   - 结束时记录完成，不临时补新题
   - 休息时不接着看录屏或岗位页面；可以喝水、走动和放松眼睛，让下一周仍有持续投入的精力。

**完成后逐项验收**

- 权限链图有身份来源与拒绝点，其中至少一句注明尚未验证的限制，另有一句写下一次可执行的验证步骤。
- 复盘包含一个真实错误及测试
- 下周并发问题能表述为可执行实验
- 完成30分钟离屏且记录实际投入

**保留的学习产物**

- 权限链图与周复盘
- 并发实验候选及预算

**问题排查**

- 只背401/403定义而说不出判断位置：用自己的登录中间件和service定位代码，给每个状态绑定一条测试。
- 未完成项全部叠加下周造成超预算：先保留认证/正确性阻塞项，将非必做和额外题暂缓，总分钟保持1200。

**复盘问题**

- 服务器在哪一步把客户端token变为可信用户？
- 哪种并发问题不会被Go race检测出来？

**可选延伸（从已有预算中调配时间）**

- 非必做：不追加学习；需要补图只在30分钟复盘内调配。

## 第 7 周：解决并发预约与事务问题

目标：能复现两个用户同时预约的问题，并用数据库事务保证同一设备时段不重复预订。

### w07-t01 · 用 goroutine 复现竞争条件（180 分钟）

操作：学习 goroutine、channel、WaitGroup 与 Mutex；写并发客户端同时预约同一设备时段，保存修复前结果。验收：能区分 Go 数据竞争与数据库业务冲突，测试可稳定启动至少 10 个并发请求。

**学习目标：** 同时发出十个同设备同区间请求，区分内存数据竞争与数据库排他规则失败，保存修复前的可重复证据。

**开始前确认**

- 第6周真实会话登录与归属测试通过
- 已有独立并发实验数据库和测试账号，不接学习主库
- 原创建逻辑仍有先检查再插入的竞争窗口，只在隔离实验环境复现

**操作步骤**

1. **学习最少同步工具 · 35 分钟**

   - 写两个goroutine等待同一start channel的短例子
   - WaitGroup在启动前Add，goroutine结束defer Done，主线程Wait
   - 结果通过channel汇总或保护切片；Mutex只保护同一进程共享内存

2. **准备十个预约请求 · 35 分钟**

   - 目标固定为同一device_id、完全相同且未来的[start,end)，准备十个已生成bcrypt哈希的虚构账号并通过/login获取各自有效session。
   - 客户端使用http.Client超时，每次读取并关闭Body
   - 先确认设备可用、目标时段无active记录，保存实验库与数据ID

3. **同步启动并收集 · 40 分钟**

   - 十个worker准备好后统一关闭start channel，不用随意sleep当屏障
   - 收集状态码、request_id、返回预约ID和本机实际耗时
   - 若未复现冲突不捏造；在测试专用服务钩子暂停于查后写前可增大窗口，钩子绝不能进入运行版本
   - 把隔离复现实验写为TestConcurrentBookingBeforeFix，-run仅在该测试已保存后使用；-v若显示no tests to run必须修正名称。

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'ConcurrentBookingBeforeFix' -count=1 -v
   ```

4. **比较HTTP与数据库 · 40 分钟**

   - 查询目标设备与区间active行，核对成功响应数与真实记录
   - 保留所有原始结果，解释多个201如何违反资源排他约束
   - 分别运行Go race并指出它针对执行到的内存访问，不检查SQL业务不变量

   ```text
   cd ~/projects/lab-booking
   go test -race ./...
   mysql -u '<测试应用用户>' -p lab_booking_test -e "SELECT id,device_id,start_at,end_at,status FROM bookings WHERE device_id=1;"
   ```

5. **形成修复问题 · 30 分钟**

   - 画两个事务先查都无记录→各自插入的交错图
   - 说明简单加Go Mutex对两个服务进程不共享，不能成为数据库排他方案
   - 给第7周第2任务写准确验收：同设备同区间十请求至多一个active成功

   ```text
   cd ~/projects/lab-booking
   git diff -- '*_test.go'
   ```

**完成后逐项验收**

- 十worker有统一启动屏障
- 保存实际响应和数据库记录
- 能区分race报告与业务冲突
- 复现失败时如实记录并给出改进实验方法

**保留的学习产物**

- 并发客户端/测试
- 修复前原始结果
- 交错时序图

**问题排查**

- WaitGroup测试偶尔提前结束或负计数：主线程启动前Add，worker每条退出路径统一defer Done，避免重复Done。
- 测试自己写结果切片产生race掩盖业务问题：通过结果channel由一个收集者写，或用Mutex保护结果，不把客户端bug当预约漏洞。

**复盘问题**

- 十个goroutine是否一定并行执行？
- 如果race通过但数据库有十条冲突记录，失败在哪一层？

**参考资料**

- [Go by Example：协程与同步](https://gobyexample-cn.github.io/)
- [Go 官方：执行数据库事务（2026-10-12 已核对）](https://go.dev/doc/database/execute-transactions)
- [Go by Example：协程与同步](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟启动两个隔离实例复现Go锁局限，替换结果整理；先保证单实例证据可靠。

### w07-t02 · 在事务中检查时段重叠（180 分钟）

操作：为预约开启事务，先锁定目标设备行，再按 start < existingEnd 且 end > existingStart 检查 active 预约；所有新预约遵循同一加锁顺序。验收：相邻时段允许预约，重叠时段被拒绝，失败路径执行回滚。

**学习目标：** 在InnoDB事务中按设备串行化创建并使用当前读检查active重叠，保证同设备区间排他，失败路径完整回滚。

**开始前确认**

- 已保存先查后写竞争证据
- devices/bookings均为InnoDB，start<end且UTC策略统一
- 采用设备级锁牺牲同设备写入并行度换取易验证正确性

**操作步骤**

1. **确认区间和锁顺序 · 35 分钟**

   - 用existing.start<new.end且existing.end>new.start定义左闭右开重叠
   - 手算相邻、包含、完全相同、不同设备四类，取消记录不占用时段
   - 全部创建/取消/启停遵循device行→booking行的固定顺序

2. **开启SQL事务并锁设备 · 40 分钟**

   - 用db.BeginTx(ctx,nil)，成功后立即defer tx.Rollback处理所有错误出口
   - 通过tx.QueryRowContext按设备主键SELECT ... FOR UPDATE并检查enabled
   - 设备行存在时能锁住排他入口，即使bookings表当前无行也有可锁对象；不依赖空结果锁

   ```text
   cd ~/projects/lab-booking
   go doc database/sql.DB.BeginTx
   go doc database/sql.Tx
   ```

3. **当前读检查后插入 · 45 分钟**

   - 用tx.QueryContext执行重叠条件SELECT ... FOR UPDATE，避免REPEATABLE READ旧快照漏掉前一个提交
   - 条件参数化：device_id、active、newEnd、newStart；数据库语句全通过同一个tx
   - 无重叠才INSERT，关闭查询rows并检查Err；冲突返回领域409后Rollback

4. **统一其他写入路径 · 35 分钟**

   - 取消先得到不可变device_id，再锁device并锁/重查booking归属状态后更新
   - 设备启停也先锁同一device行后修改，使启停与创建决定按获得锁顺序生效
   - Commit失败不返回201；不在事务中进行网络调用、密码哈希或等待用户输入

5. **验证边界与失败 · 25 分钟**

   - 用相邻时段验证允许、覆盖/被覆盖验证409、取消后验证可重新预约
   - 模拟插入失败与ctx超时检查未残留提交记录
   - 在README说明该保证要求所有写入走同一协议，唯一键不解决任意区间重叠

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'Overlap|Transaction|Adjacent' -v
   ```

**完成后逐项验收**

- 十请求同设备同区间只有一个提交成功
- 相邻[10,11)/[11,12)都可成功
- 错误和冲突均回滚且Commit错误不报成功
- 创建/取消/启停使用同一设备锁顺序

**保留的学习产物**

- 事务创建实现及边界测试
- 锁顺序与时序说明
- 失败路径验证记录

**问题排查**

- 事务里混用db.Query与tx.Exec形成两条连接：事务期间只调用tx方法，外部db调用不属于该事务，逐行检查调用者。
- 锁设备后仍用旧快照查询漏看已提交预约：冲突查询采用FOR UPDATE当前读，尤其默认REPEATABLE READ下不可依赖早先普通SELECT的快照。

**复盘问题**

- 为什么锁存在的设备行比锁不存在的预约更容易证明正确？
- 所有写入遵守协议这一前提如何在代码审查中保证？

**参考资料**

- [李文周：MySQL 事务](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方：执行数据库事务（2026-10-12 已核对）](https://go.dev/doc/database/execute-transactions)
- [MySQL 官方：InnoDB 锁定读（2026-10-12 已核对）](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)
- [李文周：MySQL 事务](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟对比READ COMMITTED实验，从时序整理调配；不先优化掉设备锁或自造区间索引。

### w07-t03 · 补并发与取消预约的集成测试（180 分钟）

操作：在独立测试库重建迁移，测试同设备同时间、不同设备、相邻时间及取消后的重新预约；并发创建和取消遵循同一事务约定。验收：同一时段并发请求只有一个成功，数据库实际记录与响应一致，测试不碰个人或正式数据。

**学习目标：** 在独立MySQL测试库验证真实事务、取消与并发不变量，检查响应和提交记录一致，避免仅靠存储替身证明锁正确。

**开始前确认**

- 事务创建/取消/启停已统一device→booking锁顺序
- 测试DSN明确指向lab_booking_test并有受限账号
- 只允许初始化指定测试库，禁止DROP或清空开发/通讯录库

**操作步骤**

1. **设计测试库保护 · 35 分钟**

   - 测试启动读取TEST_DB_DSN并核对SELECT DATABASE()必须等于lab_booking_test或明确_test后缀白名单
   - 缺配置时集成测试skip并说明原因，不能报告已验证数据库
   - 迁移和种子在测试库执行，清理只删本次测试ID；并发测试不可用一条外层事务包住所有连接
   - 真实库测试统一命名TestIntegration...并保存*_test.go；先在开发库名配置下验证会拒绝启动，再切到测试库。

2. **同区间排他测试 · 45 分钟**

   - 十个独立客户端/连接统一屏障向同设备同区间创建
   - 断言一个201、其他409且零异常5xx；查询恰一条active并对齐ID
   - 重复多轮但每轮用全新设备或未来区间，防止旧结果污染

   ```text
   cd ~/projects/lab-booking
   # 先在当前Shell安全设置TEST_DB_DSN，不在记录中打印。
   go test ./... -run 'Integration.*SameSlot' -count=5 -v
   ```

3. **允许并行场景 · 35 分钟**

   - 不同设备相同时间都应成功，相同设备相邻区间都应成功
   - 包含和交叉区间应冲突，取消记录不计入active重叠
   - 若目标空库之外有历史记录，明确用测试ID过滤，禁止用全表行数判断

4. **创建与取消交错 · 40 分钟**

   - 构造旧active预约与新同区间创建同时执行，旧取消和新创建都遵循相同锁协议
   - 允许创建先看到旧active返回409，或取消先提交后新创建201；最终active至多一条
   - 取消完成后再顺序重试创建应成功；同时验证启停与创建按锁获取顺序决定结果

5. **保存结果与恢复 · 25 分钟**

   - 检查超时失败的事务没有提交新预约，测试结束无持有设备锁的连接
   - 保存环境、隔离级别、命令、请求分布和行查询，不虚构次数
   - 将真实失败最小化并纳入回归；仅清理本轮生成的测试记录

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'Integration.*(Cancel|Adjacent|DifferentDevice)' -count=1 -v
   go test -race ./...
   ```

**完成后逐项验收**

- 同区间十请求一成功且一条active
- 不同设备和相邻区间允许成功
- 创建/取消交错满足最终排他不变量
- 测试有库名保护且不碰其他数据

**保留的学习产物**

- 独立库集成测试
- 并发结果及数据库断言
- 测试初始化/清理说明

**问题排查**

- 外层事务回滚后仍留下测试行：并发HTTP使用其他连接不在外层事务中；使用隔离测试库与按测试ID清理。
- 同时取消与创建时要求两者必成功导致误报：按锁顺序接受409或201两种合法串行结果，关键断言最终排他；取消后顺序重试另测。

**复盘问题**

- 哪些测试必须用真正MySQL，为什么替身不够？
- 响应201后查不到记录，说明应检查哪一步？

**参考资料**

- [李文周：数据库与测试](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方：执行数据库事务（2026-10-12 已核对）](https://go.dev/doc/database/execute-transactions)
- [MySQL 官方：InnoDB 锁定读（2026-10-12 已核对）](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)
- [李文周：数据库与测试](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟跨两个本机实例验证相同约束，替换重复轮次整理；需先通过单实例真实库测试。

### w07-t04 · 理解隔离级别、锁与连接池（180 分钟）

操作：用两个数据库会话观察锁等待；记录事务时长，设置连接池上限与请求超时；写下一个死锁原因与统一加锁顺序。验收：能解释事务原子性、隔离性和连接池为何不能无限大，保存一段可复现的锁等待步骤。

**学习目标：** 用两个MySQL会话看见锁等待，学习事务隔离和连接池成本，并为请求超时与失败重试设清晰边界。

**开始前确认**

- 事务业务排他测试已有基线
- 准备两个Ubuntu终端连接同一独立测试库
- 只操作固定测试设备，不在开发库制造长事务

**操作步骤**

1. **读取实际配置 · 30 分钟**

   - 记录SELECT VERSION()和@@transaction_isolation，不假定所有机器默认相同
   - 区分普通一致性读、FOR UPDATE当前读与持锁直到提交/回滚
   - 画ACID各一个预约例子，隔离级别不自动实现业务时段约束

   ```text
   cd ~/projects/lab-booking
   mysql -u '<测试应用用户>' -p lab_booking_test -e 'SELECT VERSION(), @@transaction_isolation;'
   ```

2. **观察两会话锁等待 · 45 分钟**

   - A终端BEGIN并锁设备主键，B终端BEGIN锁同一行观察等待
   - A先ROLLBACK让B继续，再B ROLLBACK；记录获得锁顺序与实际等待时长
   - 另选不同设备观察可继续，解释粒度不等于全表锁

   ```text
   cd ~/projects/lab-booking
   mysql -u '<测试应用用户>' -p lab_booking_test
   # 仅测试库A/B交互执行：BEGIN; SELECT id FROM devices WHERE id=1 FOR UPDATE;
   # A释放：ROLLBACK; B完成后也执行ROLLBACK;
   ```

3. **设置并观察连接池 · 40 分钟**

   - 读DB.SetMaxOpenConns、SetMaxIdleConns及DB.Stats，选小的学习上限如5并注明实验配置
   - 请求ctx覆盖排队与SQL，给数据库连接设置合理生命周期，不无限大
   - 比较十并发时WaitCount/WaitDuration变化，数字来自实际输出

4. **分析死锁与超时 · 35 分钟**

   - 举两个业务路径以不同设备顺序加锁的循环等待反例，统一ID升序或单设备协议
   - 遇MySQL死锁/锁超时，回滚整个业务事务后才可做少量有界重试，超出deadline停止
   - 不盲重试Commit结果不确定的创建；记录事务时长并移出慢外部操作

5. **写调试说明 · 30 分钟**

   - 保存双会话步骤、连接池配置与实测统计
   - 检查每次错误路径释放rows、事务和连接，未释放会耗尽池
   - 用自己的预约解释为什么增大池可能加重MySQL压力

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'Pool|Timeout|Rollback' -v
   ```

**完成后逐项验收**

- 双会话等待步骤可重现且最后回滚
- 知道实际隔离级别
- 保存连接池实测等待统计
- 能解释固定锁顺序、短事务及有界重试

**保留的学习产物**

- 锁等待实验记录
- 连接池配置与Stats样本
- 死锁/超时处理卡

**问题排查**

- B一直等待是因为A忘记结束事务：在A显式COMMIT/ROLLBACK，检查终端不是仅退出输入；所有实验最终释放事务。
- 池上限调成1后事务内再调db查询卡住：事务占用连接，再用db请求第二条会等待；改成同一tx方法并查连接泄漏。

**复盘问题**

- 连接池排队和数据库锁等待如何区分？
- 事务重试为什么不能只重跑最后一条INSERT？

**参考资料**

- [李文周：MySQL 与连接池](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方：连接管理（2026-10-12 已核对）](https://go.dev/doc/database/manage-connections)
- [MySQL 官方：InnoDB 锁定读（2026-10-12 已核对）](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)
- [Go 官方：执行数据库事务（2026-10-12 已核对）](https://go.dev/doc/database/execute-transactions)
- [李文周：MySQL 与连接池](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟在测试库复现双设备死锁，从统计整理调配，执行前明确两终端的回滚退出路径。

### w07-t05 · 并发、并行、调度与 Linux 观测（150 分钟）

操作：使用 top、ps 与服务日志观察并发测试，比较 CPU 密集与等待数据库时的行为；画出 goroutine、线程、进程关系。验收：用自己的话解释并发与并行，说明 Go Mutex 不能代替跨进程数据库事务。

**学习目标：** 结合小实验解释并发、并行和调度，用Linux观测进程线程与等待行为，避免把goroutine数量当CPU利用率。

**开始前确认**

- 并发请求脚本和服务日志可用
- 知道PID、线程和goroutine是不同概念
- 不重装Go工具，本机Ubuntu用户只观察自己的进程

**操作步骤**

1. **画执行单元关系 · 30 分钟**

   - 画Go服务进程包含OS线程、Go runtime调度goroutine关系
   - 说明goroutine在等待网络/锁时可让出执行，不等于固定一条OS线程
   - 比较并发的交错推进与多核并行的同一时刻执行

2. **观察服务进程 · 30 分钟**

   - 启动本机服务，用ps找自己的PID再观察线程列表
   - 用top线程视图查看运行状态，记录实际CPU核心和采样时间
   - 解释ps线程数不等于runtime.NumGoroutine，避免数字混用

   ```text
   cd ~/projects/lab-booking
   ps -eo user,pid,ppid,nlwp,stat,comm,args
   top -H -p '<本机Go服务PID>'
   ```

3. **比较计算与等待 · 35 分钟**

   - 写有限次数CPU循环和等待数据库的两个小实验，不搞无限占核
   - 在相同短时间窗口观察CPU、完成耗时和请求日志
   - 把SQL行锁等待与CPU忙区别，未测到明显差异就保留原现象

4. **解释跨进程边界 · 30 分钟**

   - 画两个Go实例各自Mutex但共享一个MySQL的图
   - 说明内存锁只约束同一地址空间，设备数据库锁才约束共同写入协议
   - 区分竞态检测能发现的map并发访问与SQL重叠业务冲突

5. **记录可证明结论 · 25 分钟**

   - 整理观测命令、PID、线程数和一次请求耗时，不做生产性能推断
   - 用一分钟讲清“CPU低也可能接口慢”的一个实测或可验证原因
   - 把调度原理只记到实验解释所需深度，不在本周钻runtime源码

   ```text
   cd ~/projects/lab-booking
   ps -L -p '<本机Go服务PID>' -o pid,tid,stat,comm
   tail -n 30 logs/dev.log
   ```

**完成后逐项验收**

- 能区分并发与并行
- 进程/线程/goroutine概念未混用
- 保存计算与等待的实际观测
- 知道Go Mutex不能保证跨进程预约排他

**保留的学习产物**

- 执行单元关系图
- Linux采样记录
- 等待与CPU对照说明

**问题排查**

- Go run看到的是编译包装进程：用args/父子PID辨认真实server进程；记录实际监听端口对应PID再top观察。
- CPU低便断言服务无瓶颈：检查数据库锁、连接池等待与请求日志，低CPU只能说明该采样窗口CPU不忙。

**复盘问题**

- 一个线程可以推进多个goroutine吗？
- 两个实例共享数据库时哪些状态必须由数据库协调？

**参考资料**

- [缺失的一课：性能分析](https://missing-semester-cn.github.io/)
- [Go 官方：连接管理（2026-10-12 已核对）](https://go.dev/doc/database/manage-connections)
- [缺失的一课：性能分析](https://missing-semester-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟对比GOMAXPROCS=1的有限CPU实验，从图整理调配；不为结论强行占满所有核心。

### w07-t06 · 二分边界与区间题（150 分钟）

操作：完成 lower_bound 风格的查找边界与合并区间两题；把预约的左闭右开时段与区间边界联系起来。验收：覆盖相邻区间、包含区间、空输入，能解释你的循环不变量和复杂度。

**学习目标：** 在二分查找中维护边界不变量，并区分一般合并区间与预约左闭右开重叠语义。先写契约再编码，避免两题边界混用。

**开始前确认**

- 已写过二分查找和排序，理解O(log n)
- 预约采用[start,end)且相邻允许
- 算法输入独立于数据库实验，不用算法替代事务

**操作步骤**

1. **确定两题契约 · 25 分钟**

   - lower_bound返回有序切片首个>=target下标，可等于len
   - 合并区间明确选择半开区间，只在next.start<current.end时重叠
   - 准备空、全相同、target超两端、相邻与包含例子

2. **手推二分边界 · 35 分钟**

   - 使用[lo,hi)且hi初始len，写左侧<target、右侧>=target不变量
   - mid=lo+(hi-lo)/2避免相加溢出，等于target时收缩hi
   - 逐轮手算[1,2,2,4]查2与5，证明循环终止

3. **实现合并区间 · 35 分钟**

   - 先按start排序，同start按end排；校验start<end
   - 有重叠时扩展max(end)，无重叠时输出当前区间
   - 用[10,11)与[11,12)说明本契约不会合并；若题库闭区间题需另写规则
   - 排序会改变原切片顺序，若要求保留输入先复制；输出区间也避免与输入底层数组意外共享。

4. **测试与复杂度 · 30 分钟**

   - 表驱动覆盖空、负数、重复值、包含与完全相同区间
   - lower_bound用线性解作小输入对照，合并后检查排序与无重叠
   - 说明二分O(log n)/O(1)，合并O(n log n)含排序与O(n)输出

   ```text
   cd ~/projects/lab-booking
   mkdir -p exercises/interval
   go test ./exercises/interval -v
   ```

5. **连接业务但守住边界 · 25 分钟**

   - 写合并算法适于离线整理而非并发预约排他证明
   - 关掉代码口述一轮不变量和一个相邻反例
   - 记录一次<=与<用错的边界，以及回归测试

   ```text
   cd ~/projects/lab-booking
   go test ./exercises/interval -count=1
   ```

**完成后逐项验收**

- lower_bound空输入与target超范围正确
- 重复值返回首个位置
- 半开相邻区间不误判重叠
- 能解释两题复杂度和数据库并发局限

**保留的学习产物**

- 两题源码与测试
- 二分不变量图
- 区间语义对照笔记

**问题排查**

- lower_bound找到任意重复位置即返回：目标是首个>=，相等也继续hi=mid，最后返回lo。
- 照搬闭区间合并用<=导致相邻预约冲突：先写区间契约；本题半开用严格<，题库若定义闭区间再改变条件。

**复盘问题**

- 为什么hi可等于len而不能访问a[hi]？
- 区间算法正确为什么仍不能替代数据库锁？

**参考资料**

- [Go by Example：排序与切片](https://gobyexample-cn.github.io/)
- [MySQL 官方：InnoDB 锁定读（2026-10-12 已核对）](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)
- [Go by Example：排序与切片](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟做随机短数组与线性解对照，替换口述整理，不另加新算法题。

### w07-t07 · 练习并发项目讲解并继续投递（120 分钟）

操作：准备“问题如何复现、如何加锁、如何验证”的 3 分钟讲解；阅读岗位要求，投递 5 个匹配岗位并记录反馈。验收：简历只写测试过的并发行为，保留测试命令和结果，不把本机测量说成生产规模。

**学习目标：** 把并发问题、锁方案和实验结论讲成三分钟证据链，继续匹配岗位投递，不把本机实验扩大成生产规模。

**开始前确认**

- 独立MySQL集成测试已保存命令、数据量、请求与记录
- 锁定设备行及当前读方案自己能解释
- 简历与投递表保持第6周真实状态

**操作步骤**

1. **准备三段项目讲解 · 30 分钟**

   - 第一段讲十请求先查后写如何产生重叠，并展示交错图
   - 第二段讲设备行锁→当前读→插入→Commit，取消和启停共用顺序
   - 第三段讲同设备同区间只有一个成功、相邻/不同设备允许，注明实际环境

2. **核验简历用语 · 25 分钟**

   - 每条并发描述绑定测试文件、命令与查询记录
   - 可写验证同设备区间排他，但不写百万并发、性能提升或线上用户量
   - 解释设备级串行的代价和所有写入遵守协议的前提

   ```text
   cd ~/projects/lab-booking
   git log -5 --oneline
   go test ./... -run 'Integration.*SameSlot' -count=1 -v
   ```

3. **筛选并投递 · 40 分钟**

   - 访问本人岗位表中的官方入口，核验当前开放与研究生实习条件
   - 选择5个匹配的Go或后端实习岗位，由本人提交/跟进
   - 无合适项如实保留原因，不以增加数量替代到岗与课程条件匹配

4. **回听和记录反馈 · 25 分钟**

   - 录3分钟讲解，标记一个解释不清的锁/隔离问题
   - 更新投递状态、日期、城市、入口和下一次跟进
   - 只选一个真正高频缺口进入下周，避免无限扩展技术栈

**完成后逐项验收**

- 讲解包括复现、方案、验证及局限
- 简历并发内容有本机实测证据
- 本人投递/跟进5项或记录不足
- 投递表与一条表达改进更新

**保留的学习产物**

- 三分钟讲解及提纲
- 简历证据索引
- 投递跟踪表

**问题排查**

- 把race通过作为并发预约正确性证据：补真实MySQL的区间排他与记录断言，解释race仅检查运行到的内存竞争。
- 面试背锁名但答不出空表怎么锁：说明锁既有设备主键行，即使预约集合为空也有排他入口，再讲统一写入协议。

**复盘问题**

- 你能用一个反例解释为什么先查后写不够吗？
- 设备锁方案的代价和下一步优化证据是什么？

**参考资料**

- [字节跳动校园招聘官方入口（2026-10-12已打开，仅供当次核验岗位）](https://jobs.bytedance.com/campus/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟让同学追问三次为什么，调配回听时间；投递不承诺面试结果。

### w07-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟整理事务流程图和一个最难排查的问题；30 分钟离屏活动。验收：记录当前预约一致性的条件、实际时长与尚未验证的边界。

**学习目标：** 整理预约一致性成立的前提和当前未验证边界，用证据约束下一周测试范围，保留半小时离屏。复盘的目的在于校准难度与证据，不是补做整周工作；有遗漏便选最小阻塞项重新排期，并明确放弃本周可选延伸。

**开始前确认**

- 有事务流程图、集成测试与一处难题记录
- 本周实际时长和投递状态已累计
- 不把未完成边界默认为已解决

**操作步骤**

1. **事务阶段复盘 · 30 分钟**

   - 前10分钟画device锁→enabled→重叠当前读→insert→commit及错误rollback，标注取消同锁顺序
   - 中间10分钟选最难问题写现象、假设、证据、修复，区分猜想与实验结果
   - 最后10分钟列三个保证前提和两个未测边界，累计实际时长，给第8周只选正确性阻塞项
   - 复盘输出只保留能带来下一步动作的事实：用“现象→证据文件/命令→仍不确定点→下次验证”写一小段；若某功能未完成就标未完成，不为勾选任务改写结论。

2. **离屏活动 · 30 分钟**

   - 停止看SQL和测试报告，散步或伸展完整半小时
   - 不在休息段继续重跑实验，待办用一句话留到下周
   - 记录离屏完成，若超预算先删可选延伸
   - 休息时不接着看录屏或岗位页面；可以喝水、走动和放松眼睛，让下一周仍有持续投入的精力。

**完成后逐项验收**

- 流程图包含Commit与所有失败回滚，其中至少一句注明尚未验证的限制，另有一句写下一次可执行的验证步骤。
- 列出统一协议等一致性前提
- 未测边界有明确下周验证任务
- 完成30分钟离屏且总预算可追踪

**保留的学习产物**

- 事务复盘与难题卡
- 第8周验证清单

**问题排查**

- 流程图只有正常路径没Commit失败：补错误出口和Rollback，明确Commit失败不能向客户端返回创建成功。
- 为了补完边界把下周测试排超20小时：优先排他、权限和复现阻塞项，暂缓装饰性功能与性能优化。

**复盘问题**

- 哪些直接SQL写入可能绕过你的设备锁协议？
- 目前哪条一致性结论仍只是假设，需要实测？

**可选延伸（从已有预算中调配时间）**

- 非必做：不增加时长；进一步画图仅替换复盘段内一项整理。

## 第 8 周：补齐测试，交付预约项目第一版

目标：把可运行项目整理成别人能复现的交付物，形成真实的简历证据并保持投递。

### w08-t01 · 审查预约流程与接口边界（180 分钟）

操作：逐接口检查输入、身份、权限、事务、返回码；修复缺少的设备状态与时间边界校验，整理 API 表。验收：登录、预约、冲突、取消、管理员设备管理都有成功和失败的 curl 示例。

**学习目标：** 按完整请求链审查输入、身份、权限、设备状态、事务及返回码，修补影响演示和正确性的漏洞。

**开始前确认**

- 登录、权限、状态与事务集成测试已有记录
- 当前接口表及错误结构可查
- 只修复既有范围，不在审查中增加审批、通知或前端

**操作步骤**

1. **制作接口审查表 · 30 分钟**

   - 按登录/退出/设备查询/启停/创建/本人列表/取消逐行列输入、身份、授权、状态码
   - 为每行标出使用的handler/service/store及事务位置
   - 对照README与代码，注明管理员只管理设备的实际权限范围

2. **审查时间与输入 · 40 分钟**

   - 确认RFC3339解析、UTC归一、start<end、过去开始及设备ID合法性
   - 请求体大小、非法JSON、未知字段和重复关键字段按约定处理，避免隐式接受错误数据
   - 审查空列表、不存在记录和重复取消契约，状态返回一致

3. **审查认证与权限 · 35 分钟**

   - 确认所有受保护接口走session认证，无DEMO_USER_ID旁路
   - 用户与角色只来自服务器查得的身份，A列表不能见B、A取消B被拒绝
   - 退出/过期检查真实撤销，日志和响应没有token/hash/密码

4. **审查事务协议 · 45 分钟**

   - 确认enabled与冲突检查在锁定device后执行，冲突读为FOR UPDATE
   - 检查创建/取消/启停统一device→booking，错误全回滚、Commit失败不报201
   - 保留相邻允许、同区间排他和启停交错测试证据，不用独立Go锁替代

5. **补契约与演示 · 30 分钟**

   - 修复一个实际遗漏并加对应回归，不凭想象改动无证据代码
   - 每条关键接口保存一个成功/失败的脱敏curl示例
   - 接口表注明本机HTTP例外和未实现业务限制

   ```text
   cd ~/projects/lab-booking
   go test ./...
   curl -i -b /tmp/lab-cookie-a.txt --data @scripts/booking-demo.json -H 'Content-Type: application/json' http://127.0.0.1:8081/bookings
   git diff --check
   ```

**完成后逐项验收**

- 接口表覆盖七类操作与成功/失败
- 无演示认证旁路及客户端可信身份
- 启停/冲突在设备锁后校验
- 修复有回归且限制如实列出

**保留的学习产物**

- API审查表与curl示例
- 真实缺陷修复及测试
- 限制清单

**问题排查**

- README允诺管理员取消所有预约而代码只许本人：按实际业务矩阵统一文档、service与测试，不能只改状态码掩盖差异。
- 状态检查在事务外能通过单测却有竞态：将enabled和重叠检查移至设备锁后，补创建与启停交错的真实库测试。

**复盘问题**

- 哪条输入边界只检查了客户端而缺服务端校验？
- 接口契约与代码冲突时你怎样决定并验证修正？

**参考资料**

- [李文周：Go Web 开发](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：Go Web 开发](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟人工走一次陌生路径，替换示例整理；不扩展新功能。

### w08-t02 · 完成分层测试与回归（180 分钟）

操作：为纯业务函数写单元测试，用 httptest 测接口，在独立库测事务；执行 go test ./...、go test -race ./...、go vet ./...。验收：检查通过，覆盖一次之前修复的真实 bug，说明哪些行为仍需人工验证。

**学习目标：** 用业务单测、HTTP测试和真实数据库集成测试构成最小回归层次，完整运行Go检查并保留范围限制。

**开始前确认**

- 第6周权限测试、第7周真实MySQL测试及库名保护已完成
- 本机WSL已有gcc，可运行Go race
- TEST_DB_DSN由本机安全配置，不显示在输出和Git

**操作步骤**

1. **按行为分类测试 · 30 分钟**

   - 纯时间/区间函数单测，httptest验证解析/状态/权限，MySQL集成测锁和持久化
   - 列出每层能发现什么及不能证明什么，不把层数当质量
   - 选之前真修过的bug作为本次必跑回归

2. **修补缺失的最小用例 · 40 分钟**

   - 补空/非法时间、过期会话、越权无修改、相邻和包含冲突
   - 用测试替身只替换必要store接口，不为所有函数建mock框架
   - 不靠sleep断言过期/并发，时间可控、并发用屏障

3. **运行正常与竞态检查 · 40 分钟**

   - 先go test全套，再race检测实际执行路径，记录退出码和失败
   - 数据库集成未设置DSN而skip时显式写未验证，不能混成全通过
   - race失败先定位共享map/结果收集，修后只重跑受影响与全套一次

   ```text
   cd ~/projects/lab-booking
   go test ./... -count=1
   go test -race ./... -count=1
   go vet ./...
   ```

4. **运行真实库与故障回归 · 40 分钟**

   - 在lab_booking_test跑同区间排他、不同设备、取消交错、ctx失败回滚
   - 检查只使用测试库，执行前核对保护报错可用
   - 用数据库实际行状态核对HTTP，不只依赖mock返回值
   - 确认-v列出已运行的TestIntegration用例与断言，出现no tests to run不能视作事务检查通过。

   ```text
   cd ~/projects/lab-booking
   go test ./... -run 'Integration' -count=1 -v
   ```

5. **保存结果与待人工项 · 30 分钟**

   - 写Go/MySQL版本、命令、结果、已知skip和测试数据规则
   - 列Cookie属性、启动文档、新目录复现等人工项
   - 把覆盖率可选记录为观察，禁止用100%替代行为证据

   ```text
   cd ~/projects/lab-booking
   git diff --check
   git status --short
   ```

**完成后逐项验收**

- 单测、HTTP、真实库测试范围明确
- go test/race/vet有实际结果
- 真实bug回归保持通过
- skip与人工验证没有被隐藏

**保留的学习产物**

- 回归测试及最小修复
- 检查执行记录
- 覆盖范围与人工清单

**问题排查**

- go test显示通过但集成测试全部skip：查看-v输出和TEST_DB_DSN保护条件；真实库未执行就标未验证并补跑。
- race干净便称无并发漏洞：说明仅覆盖执行过的内存竞争，继续用MySQL排他断言证明资源规则。

**复盘问题**

- 为什么某些SQL测试不能放在业务函数单测里？
- 现有测试中哪个失败最能防止已修bug复发？

**参考资料**

- [李文周：测试与工具链](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方：竞态检测（2026-10-12 已核对）](https://go.dev/doc/articles/race_detector)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [李文周：测试与工具链](https://liwenzhou.com/posts/go/golang-menu/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟看go test -cover的未覆盖分支，替换范围整理；只为真实风险补测试。

### w08-t03 · 测量并发请求与定位瓶颈（180 分钟）

操作：写小型 Go 请求脚本，对设备列表与预约分别测 1、10、30 并发，记录机器、数据量、成功数、错误数和耗时分位数。验收：保留脚本与原始结果，用日志解释一个慢请求，不把压测本身当作优化成绩。

**学习目标：** 在受控本机负载下测设备列表和预约的耗时分布，区分预期冲突与异常错误，并定位一条慢请求。

**开始前确认**

- 第7周事务正确性已验证，脚本使用独立性能测试数据
- 保留机器、Go/MySQL版本、表规模及连接池配置
- 只对127.0.0.1实验，不对第三方服务压测

**操作步骤**

1. **固定实验条件 · 30 分钟**

   - 记录CPU/内存、WSL环境、数据行数、索引、隔离级别、连接池上限
   - 每组指定并发1/10/30、总请求数、预热量和重复轮次
   - 设备列表只读；预约成功组使用不同设备或不重叠区间，竞争组同一设备同一区间另测
   - 停掉开发实例，另用lab_booking_perf_test独立库启动实验服务；启动时核对实际库名，种子和清理仅触及本轮生成ID，不复用真实预约数据。

2. **写有限请求客户端 · 45 分钟**

   - 复用带Timeout的http.Client，worker数控制并发而不是一次启动无限goroutine
   - 每请求记录开始/结束、状态码、request_id、响应ID，读完关闭body
   - 结果通过channel汇总，排除预热；总样本数与实际完成数必须吻合
   - 先创建cmd/loadtest/main.go及少量分位数/参数测试，再执行下方命令；写场景先用同一受保护登录流程获取测试会话，秘密不放flags或结果文件。

   ```text
   cd ~/projects/lab-booking
   # 自行实现cmd/loadtest的这些参数后再运行：
   go run ./cmd/loadtest -base http://127.0.0.1:8081 -scenario devices -concurrency 1 -requests 100
   ```

3. **运行三组并发 · 40 分钟**

   - 按1/10/30重复设备列表与成功预约场景，每轮使用可识别的新测试区间
   - 再跑同区间竞争，409列为预期业务冲突而非服务器故障，5xx和超时另计
   - 实际参数、原始CSV/JSON及日志一并保存；不足样本不编造分位数

   ```text
   cd ~/projects/lab-booking
   go run ./cmd/loadtest -base http://127.0.0.1:8081 -scenario devices -concurrency 10 -requests 100
   go run ./cmd/loadtest -base http://127.0.0.1:8081 -scenario devices -concurrency 30 -requests 100
   ```

4. **计算与定位 · 35 分钟**

   - 耗时升序按nearest-rank记录p50/p95及样本数，统一毫秒；说明端到端客户端时间
   - 通过一个最慢request_id关联服务日志、SQL耗时或池等待统计
   - 没有明显瓶颈也保留事实，不能由总耗时推断单次SQL或宣称优化

5. **写可重跑结论 · 30 分钟**

   - 将成功率、预期409、异常数和分位数按场景分开列
   - 注明没有缓存的设备列表基线，供第9周相同条件比较
   - 预约写吞吐不作为Redis缓存目标，排他规则仍由事务保证

   ```text
   cd ~/projects/lab-booking
   grep '<慢请求request_id>' logs/dev.log
   go test -race ./cmd/loadtest
   ```

**完成后逐项验收**

- 1/10/30并发有原始实测样本
- 设备列表与预约成功/竞争分场景
- p50/p95附算法、样本量、环境
- 解释一条慢请求或如实记录未定位

**保留的学习产物**

- 有限请求脚本与原始结果
- 性能条件表
- 慢请求分析及第9周基线

**问题排查**

- 同一时段压测大量409被算作服务失败：单独竞争场景报告预期409，成功吞吐场景改用无重叠数据，不合并统计。
- 直接平均每worker总时长当p95：记录每请求端到端耗时再排序按声明规则取分位数，同时保留样本数。

**复盘问题**

- 并发度、总请求数和吞吐之间有什么区别？
- 现有数据能证明缓存收益吗，为什么需要对照实验？

**参考资料**

- [Go by Example：HTTP 客户端与同步](https://gobyexample-cn.github.io/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [Go by Example：HTTP 客户端与同步](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟重跑一个波动较大组，替换报告润色；不为简历追求好看的数字。

### w08-t04 · 整理一键复现步骤和发布标记（180 分钟）

操作：完善 README、配置示例、迁移、演示数据与测试步骤；用新目录 clone 并重建项目，确认秘密与二进制未入库，提交后打 v0.1.0 标签。验收：从空目录按 README 能完成登录与预约，有一段本机演示记录。

**学习目标：** 把启动、迁移、种子、配置和测试步骤做成新目录可复现的交付，确认秘密未提交后打本地学习版本标签。

**开始前确认**

- 关键回归检查与API审查完成
- Git仓库已有本地提交，真实配置/凭据已忽略
- 复现使用新空目录与新的学习库，不删除开发库

**操作步骤**

1. **整理启动说明 · 35 分钟**

   - README写Ubuntu/Go/MySQL已实际版本、目录、端口和运行命令
   - .env.example仅放占位参数，说明DB_DSN、APP_ADDR、会话配置与权限
   - 文档区分应用账号与迁移账号、首次迁移与已有库升级

2. **完成迁移和种子文档 · 35 分钟**

   - 列迁移编号、执行顺序及版本记录方式，seed只写虚构用户名/设备
   - 测试密码由本机交互生成hash，禁止把真实hash/token/密码进仓库
   - 列权限矩阵、设备排他协议、测试库保护与本机HTTP限制

3. **新目录实际复现 · 45 分钟**

   - 从本地Git仓库clone到新的/tmp目录，避免依赖工作区未提交文件
   - 创建独立空的复现库后按README迁移、种子、配置、启动
   - 用测试账号登录→设备→创建→冲突→取消→管理员启停，记录文档漏项并修正

   ```text
   cd ~/projects/lab-booking
   git status --short
   git clone ~/projects/lab-booking '/tmp/lab-booking-repro-<日期>'
   cd '/tmp/lab-booking-repro-<日期>'
   go test ./...
   ```

4. **审查仓库内容 · 35 分钟**

   - git ls-files核对.env、cookie jar、二进制、日志、真实投递资料未被跟踪
   - 忽略规则不追溯已跟踪文件，若发现秘密先停止发布并处理暴露凭据
   - 只提交可分享源码和文档，重新阅读diff确认内容

   ```text
   cd ~/projects/lab-booking
   git ls-files
   git diff --check
   git diff
   git status --short
   ```

5. **提交与本地标签 · 30 分钟**

   - 本地提交最终可复现版本再打带说明的v0.1.0标签
   - 已存在标签先查看，不强制覆盖；标签须指向本次验证提交
   - 保存五分钟以内本机演示和真实检查结果，远程发布由本人操作

   ```text
   cd ~/projects/lab-booking
   git add README.md .gitignore cmd internal migrations scripts docs go.mod go.sum
   git commit -m 'prepare reproducible booking v0.1.0'
   git tag -a v0.1.0 -m 'learning booking milestone'
   git show --stat v0.1.0
   ```

**完成后逐项验收**

- 新clone不依赖未提交文件能完成流程
- 配置与凭据未入Git
- README包含迁移/身份/权限/事务/测试
- v0.1.0指向实际验证提交且未覆盖旧标签

**保留的学习产物**

- 可复现README及配置示例
- 本地v0.1.0标签
- 新目录复现与演示记录

**问题排查**

- clone后缺脚本因为只在工作目录未提交：对照git status和ls-files，提交可分享脚本再重新clone验证。
- .gitignore里有.env但Git仍显示跟踪：先确认已跟踪状态；从索引移除保留本机文件，若真实秘密暴露则处理凭据与历史后再分享。

**复盘问题**

- 复现环境在哪些步骤仍依赖你自己的机器配置？
- 标签与分支在指向提交时有什么区别？

**参考资料**

- [缺失的一课：版本控制](https://missing-semester-cn.github.io/)
- [Git 官方：git-tag（2026-10-12 已核对）](https://git-scm.com/docs/git-tag)
- [缺失的一课：版本控制](https://missing-semester-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟请同学按文档复现，替换演示润色；不自动推送或发布到外网。

### w08-t05 · Linux 日志定位与 TCP 连接状态（150 分钟）

操作：用 rg、tail、ss 筛选慢请求与连接，重现服务停止、数据库停止、端口占用三种故障；写故障定位表。验收：能按“客户端→服务→数据库”顺序定位，说明 LISTEN、ESTABLISHED 的含义。

**学习目标：** 用客户端、服务、数据库的顺序定位三类本机故障，结合TCP状态与脱敏日志形成可复用排错卡。

**开始前确认**

- 服务及日志在回环8081可启动
- 只对自己启动的服务/专用数据库实验，不停止共用MySQL
- 知道PID与监听端口，命令优先Ubuntu标准工具grep/tail/ss/ps

**操作步骤**

1. **正常状态采样 · 25 分钟**

   - 健康请求保存状态码、request_id、实际目标地址
   - ss -lntp看LISTEN，ss -ntp看活跃连接；短请求可能看不到ESTABLISHED
   - tail服务日志，用grep过滤指定ID，避免输出登录敏感头

   ```text
   cd ~/projects/lab-booking
   curl -i http://127.0.0.1:8081/health
   ss -lntp
   ss -ntp
   tail -n 30 logs/dev.log
   ```

2. **模拟服务停止 · 30 分钟**

   - Ctrl+C停止自己启动的server，再curl观察连接被拒绝
   - 检查ss已无8081监听，区别HTTP404/500与未建连
   - 重新启动并验证/health恢复，记录准确PID，不乱kill全部Go进程

3. **模拟数据库不可达 · 35 分钟**

   - 优先把实验实例DB地址改为无人监听的回环端口，再启动独立实例观察诊断
   - 若确需停数据库，仅针对独立实验实例，禁止停共用数据库
   - 用应用日志区分DSN错误、连接拒绝与SQL错误，恢复配置后验证查询

   ```text
   cd ~/projects/lab-booking
   ps -eo pid,ppid,stat,comm,args
   grep -n -E 'request_id|timeout|database' logs/dev.log
   ```

4. **模拟端口占用 · 30 分钟**

   - 第一实例保持监听，第二实例绑定同端口应启动失败
   - 用ss/ps找占用者，确认是自己的服务后停第二次尝试或改实验端口
   - 避免开放0.0.0.0或强制结束不认识进程作为通用解决

5. **形成故障定位表 · 30 分钟**

   - 三行分别写现象、假设、命令、证据、修复、恢复验证
   - 说明LISTEN为等待连接、ESTABLISHED为连接已建立，不保证业务成功
   - 保存一条慢request_id的grep命令，注明未看见短连接不能推断无请求

   ```text
   cd ~/projects/lab-booking
   grep '<待定位request_id>' logs/dev.log
   curl -i http://127.0.0.1:8081/health
   ```

**完成后逐项验收**

- 三类故障有现象与恢复验证
- 定位按客户端→服务→数据库
- 能解释LISTEN/ESTABLISHED限制
- 没有停止共用数据库或误杀他人进程

**保留的学习产物**

- 三类故障定位表
- 脱敏命令与日志样本
- TCP状态解释卡

**问题排查**

- 看到连接拒绝便改SQL：先确认目标IP/端口及监听，未建立TCP连接说明还没进入SQL业务层。
- ss没抓到ESTABLISHED便认定请求未发生：短连接易错过采样，结合curl结果与请求日志验证，不凭单次ss截图下结论。

**复盘问题**

- 端口被占用与数据库连接失败各在哪条边界？
- HTTP500时为什么TCP可能仍是ESTABLISHED？

**参考资料**

- [缺失的一课：调试与命令行工具](https://missing-semester-cn.github.io/)
- [Go 官方 net/http（2026-10-12 已核对）](https://pkg.go.dev/net/http)
- [缺失的一课：调试与命令行工具](https://missing-semester-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟对比keep-alive连接状态，替换定位表润色；不安装抓包平台。

### w08-t06 · BFS 与 DFS 基础题（150 分钟）

操作：完成二叉树层序遍历与网格连通块计数；分别说明队列与递归的用途，检查访问标记。验收：两道题通过空输入和多连通块用例，能估计最坏时间与空间。

**学习目标：** 用队列做层序遍历，用访问标记做网格DFS，明确递归栈、输入形状和连通定义。

**开始前确认**

- 已完成第5周二叉树递归及第3周队列
- 网格约定上下左右四邻，不含对角线
- 练习包独立于预约事务，不为业务生搬图算法

**操作步骤**

1. **定义输入与手算 · 25 分钟**

   - 构造空树、不平衡树；网格定义0为水、1为陆地
   - 约定空网格返回0，若行长度不一致明确拒绝或逐行边界处理
   - 手画一个对角相邻但四邻不连通的例子，先数连通块

2. **实现树层序BFS · 35 分钟**

   - 用队列与head下标推进，每层记录当时队列末尾，再处理该层节点
   - 将非nil左右孩子入队，不重复处理本层新入队元素
   - 记录输出为每层切片，说明队列空间与最大层宽相关

3. **实现网格DFS · 40 分钟**

   - 外层扫描未访问陆地时计数+1，再DFS四邻
   - 先检查边界与值，标记已访问后再递归，避免相邻节点循环
   - 若选择原地改网格须写清会修改输入；用visited版本更方便对照

4. **写边界用例 · 30 分钟**

   - 覆盖空、全水、全陆、细长链、多块及对角线
   - 用小图手算对照，树测试比较分层结果而非仅扁平遍历
   - 说明树BFS O(n)，网格 O(rows*cols)，最坏递归栈同规模

   ```text
   cd ~/projects/lab-booking
   mkdir -p exercises/graph
   go test ./exercises/graph -v
   ```

5. **口述与空间复查 · 20 分钟**

   - 关代码解释为什么标记必须早于递归下一邻居
   - 区分visited空间与递归栈空间，不能只报一个集合大小
   - 记录极长网格递归风险，可选显式栈放延伸而不追加新题

   ```text
   cd ~/projects/lab-booking
   go test ./exercises/graph -count=1
   ```

**完成后逐项验收**

- 树按层输出且空树正确
- 四邻连通块结果吻合手算
- 访问标记避免重复递归
- 能说明两题最坏时间空间及修改输入选择

**保留的学习产物**

- BFS/DFS源码与测试
- 四邻网格图
- 空间与错题笔记

**问题排查**

- DFS栈溢出因为返回时才标visited：进入合法陆地后立即标记，再递归邻居，已访问分支立即返回。
- 层序遍历每层边界随append变大：处理前固定该层节点数或队列末尾，避免孩子混进当前层。

**复盘问题**

- BFS的队列与DFS的调用栈分别保存什么？
- 为何对角连接是否计入必须先写题目契约？

**参考资料**

- [Go by Example：递归、切片与 Map](https://gobyexample-cn.github.io/)
- [Go by Example：递归、切片与 Map](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 非必做：20分钟用显式栈重写网格DFS，替换空间复查与部分测试整理，不额外加题。

### w08-t07 · 预约项目进入简历，投递与模拟面试（120 分钟）

操作：将 v0.1.0 已完成功能与测试证据写入一页简历，投递 5 个岗位；录制 5 分钟自我介绍和项目讲解。验收：投递表持续更新，能回答为什么选 Go、为何用事务及自己独立改过哪里。

**学习目标：** 把v0.1.0已验证能力写进一页简历，录五分钟项目讲解并继续投递，确保个人贡献和数据来源可追溯。

**开始前确认**

- v0.1.0新目录复现和回归记录实际完成
- 第8周性能原始数据可用，未测就不写数字
- 已确认研究生出勤、到岗和可去城市条件

**操作步骤**

1. **选择简历证据 · 25 分钟**

   - 用登录/权限矩阵、设备行事务排他、新目录复现三个亮点对应提交与测试
   - 性能若写只报实际本机环境与场景，不把409竞争或未测优化作成绩
   - 标出自己设计、修改、调试与AI参考内容，避免夸大独立完成程度

2. **录五分钟讲解 · 30 分钟**

   - 一分钟讲需求与模型，两分钟讲认证/事务，一分钟测试，一分钟限制与个人改动
   - 回答为什么选Go：结合已有工具与HTTP/并发练习，不虚构语言性能比较
   - 回听删去背术语句，至少口述一次真实bug如何复现和验证

3. **投递与条件核验 · 40 分钟**

   - 在企业官方入口查5个匹配仍开放的机会，城市选择以本人可到岗为准
   - 本人提交/跟进并核验每周出勤、连续月份、硕士资格及开始日期
   - 未找到5项就记真实数量与筛选原因，不承诺获得面试

4. **修正下一轮重点 · 25 分钟**

   - 更新投递表状态和下一步日期，反馈按真实记录不猜拒绝原因
   - 任选两个追问：为何用事务、权限在哪里、自己独立改了哪里，用代码回答
   - 保存一页简历脱敏版与介绍提纲，不公开联系方式/登录凭据

   ```text
   cd ~/projects/lab-booking
   git show --stat v0.1.0
   git log -5 --oneline
   ```

**完成后逐项验收**

- 简历内容绑定v0.1.0真实证据
- 能五分钟讲模型/认证/事务/测试/限制
- 本人投递或跟进5项或记录不足
- 两条追问能用自己的代码与实验回答

**保留的学习产物**

- 一页简历与证据索引
- 五分钟录音/提纲
- 投递表及表达改进

**问题排查**

- 简历写压测提升但没有前后对照：删除提升百分比，只说明完成测量；缓存收益等第9周同条件实测后再写。
- 讲解只介绍库却无个人改动：选一个权限或事务bug，展示错误版本、自己修改点与测试，不用笼统负责后端。

**复盘问题**

- 哪个能力现在能让别人按文档验证？
- 面对面试追问时哪些结论需坦白仍未验证？

**参考资料**

- [字节跳动校园招聘官方入口（2026-10-12已打开，仅供当次核验岗位）](https://jobs.bytedance.com/campus/)

**可选延伸（从已有预算中调配时间）**

- 非必做：15分钟请同学按两个追问打断讲解，替换回听时间；不增加模拟面试时长。

### w08-t08 · 阶段复盘与主动休息（60 分钟）

操作：30 分钟比较第 1 周与现在独立完成的能力，选出一个第 9 周要测量的缓存场景；30 分钟离屏活动。验收：记录已会、需复习、暂缓各 3 项，保持下阶段每周 20 小时。

**学习目标：** 回看从通讯录到预约项目的独立能力变化，选设备列表作为缓存测量候选，建立下阶段的取舍和恢复节奏。复盘的目的在于校准难度与证据，不是补做整周工作；有遗漏便选最小阻塞项重新排期，并明确放弃本周可选延伸。

**开始前确认**

- 有第1周记录、v0.1.0复现和第8周性能基线
- 投递表与实际时长可回查
- 每周1200分钟包括复盘与离屏，不靠熬夜补齐所有延伸

**操作步骤**

1. **阶段能力与缓存候选 · 30 分钟**

   - 前10分钟各写已会、需复习、暂缓三项，分别附一次独立操作或失败证据
   - 中间10分钟对比第1周与现在的启动、排错、SQL/权限/测试能力，说明仍需帮助的位置
   - 最后10分钟选设备列表读场景给第9周缓存，记录无缓存基线、数据规模及一致性问题；预约排他不交给缓存，累计预算
   - 复盘输出只保留能带来下一步动作的事实：用“现象→证据文件/命令→仍不确定点→下次验证”写一小段；若某功能未完成就标未完成，不为勾选任务改写结论。

2. **主动离屏休息 · 30 分钟**

   - 离开终端与手机技术内容，散步或舒展
   - 不在休息中开始Redis安装或整理压测，新增想法留一句待办
   - 完成后记录休息，未完阻塞项优先调配下一周，暂缓低价值延伸
   - 休息时不接着看录屏或岗位页面；可以喝水、走动和放松眼睛，让下一周仍有持续投入的精力。

**完成后逐项验收**

- 已会/复习/暂缓各3项有依据，其中至少一句注明尚未验证的限制，另有一句写下一次可执行的验证步骤。
- 设备列表缓存候选有基线和一致性问题
- 注明预约排他仍由MySQL事务保证
- 完成30分钟离屏并保留20小时预算

**保留的学习产物**

- 阶段能力与证据表
- 第9周缓存实验候选

**问题排查**

- 计划进入第9周便认为第8周所有项已掌握：按独立复现结果分已会与需复习，不把勾选任务当理解证明。
- 为追求缓存数字想把预约冲突交Redis：只缓存设备列表读取，写事务仍保证设备排他；先明确失效/故障实验目标。

**复盘问题**

- 哪个环节如今能不用示范独立完成？
- 设备改动后缓存需要怎样失效，哪个结论还须实验？

**可选延伸（从已有预算中调配时间）**

- 非必做：本任务不额外学习；若要补基线图只在30分钟复盘内替换一项整理。

## 第 9 周：为设备列表加入可验证的缓存

目标：在真实读取场景中学习 Redis、TTL 和失效策略，保留优化前后的可比较数据。

### w09-t01 · 准备 Redis 并练习基本命令（180 分钟）

操作：在本机准备 Redis，练习 SET、GET、DEL、EXPIRE、TTL；用 Go 客户端写短程序，设置连接超时。验收：键能按时过期，Redis 停止时得到可诊断错误，配置与密码没有提交到 Git。

**学习目标：** 在Ubuntu24.04中为预约项目接入独立学习Redis，理解字符串键、过期与连接失败；把缓存视为可丢失的派生数据，而不是预约是否成功的依据。

**开始前确认**

- 第8周lab-booking能连接本机MySQL；只使用合成设备数据。
- 已安装Go1.27.2和Git；Redis尚未安装时先确认环境，不重复重装Go。

**操作步骤**

1. **确认进程与安装路线 · 30 分钟**

   - 进入WSL的Ubuntu24.04，核对当前用户与Redis客户端、服务端版本，把检测结果写入本周笔记。
   - 已有Redis则复用学习实例；缺少时按官方安装说明准备本机实例，记录选用的启动方式并限制回环监听。

   ```text
   cd ~/projects/lab-booking
   whoami
   command -v redis-server
   command -v redis-cli
   redis-server --version
   redis-cli --version
   ```

2. **建立键与过期直觉 · 35 分钟**

   - 仅使用lab-booking:study:w09前缀练习SET、GET、DEL，再给一条新键设置20秒过期。
   - 立即与稍后查看TTL，记录不存在键与没有过期时间的不同返回值；不要对其他键执行清空命令。

   ```text
   cd ~/projects/lab-booking
   redis-cli -h 127.0.0.1 SET lab-booking:study:w09 hello EX 20
   redis-cli -h 127.0.0.1 TTL lab-booking:study:w09
   ```

3. **写小型连接验证 · 55 分钟**

   - 在项目练习目录增加短Go示例，创建客户端、设置拨号和读写超时，再做Ping、Set、Get、Close。
   - 区别redis.Nil与网络错误：前者表示键未命中，后者保留原因；不把完整连接串打印到日志。
   - 通过环境变量给地址，先让读取超时明确，再解释Context与客户端超时分别控制什么。

   ```text
   cd ~/projects/lab-booking
   go get github.com/redis/go-redis/v9
   ```

4. **重现失效与恢复 · 35 分钟**

   - 临时把示例Redis地址改为未监听的本机端口，测量失败是否在预期秒数内返回。
   - 恢复地址后验证读写成功，保留前后日志；真实停止服务仅针对自己创建的学习实例。

   ```text
   cd ~/projects/lab-booking
   ss -lntp
   ```

5. **检查配置和记录 · 25 分钟**

   - 在配置样例里仅写变量名和虚构值，确认真实密码文件被忽略。
   - 运行已有测试，写出三条命令输出含义以及服务启动、停止方式，供后续缓存实验复用。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   git diff --check
   ```

**完成后逐项验收**

- 20秒测试键过期后Get识别未命中；能解释TTL的-1、-2。
- 短程序在错误地址下有限时返回，恢复地址后读写通过。
- 配置样例不含真实密码，Redis只监听本机。
- 能指出预约冲突仍交给MySQL事务与约束。

**保留的学习产物**

- Redis命令与版本笔记。
- 可运行连接示例和脱敏错误记录。

**问题排查**

- SET后原TTL消失：查看SET选项；缓存写入时一并带EX或Go客户端expiration，避免两条命令之间遗漏过期。
- WSL里连接被拒绝：先核对监听地址和进程，再查端口；不要默认Windows与WSL的localhost在所有模式下相同。

**复盘问题**

- 为什么未命中与连接失败需要不同判断？
- 哪些数据可以随缓存失效重建，哪些必须保存于MySQL？

**参考资料**

- [李文周：Go 操作 Redis](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：Go 操作 Redis](https://liwenzhou.com/posts/go/golang-menu/)
- [Redis 官方：Go 客户端与超时](https://redis.io/docs/latest/develop/clients/go/)
- [Redis 官方：EXPIRE 与 TTL](https://redis.io/docs/latest/commands/expire/)

**可选延伸（从已有预算中调配时间）**

- 若主任务提前完成，从记录步骤挪10分钟比较SET EX与EXPIRE；总时长不增加。

### w09-t02 · 实现设备列表旁路缓存（180 分钟）

操作：只缓存设备列表，未命中查 MySQL 再写 Redis；设备修改后删除缓存，设置 TTL；Redis 故障时回退数据库。验收：首次和再次请求能区分命中，修改设备后列表更新，预约冲突仍由数据库事务保证。

**学习目标：** 给设备列表实现旁路缓存与有限时回源，让读取可观察、修改后可失效，并明确并发读取可能回填旧值的最终一致性边界。

**开始前确认**

- Redis连接示例通过，设备列表与管理员修改API可用。
- 已有MySQL事务防止重复预约，缓存仅覆盖非敏感设备列表。

**操作步骤**

1. **约定键与读路径 · 30 分钟**

   - 画出命中、未命中、Redis错误三条分支，记录键中必须包括页码、每页条数和筛选参数。
   - 初始只缓存一个已定义的列表范围，设置例如30秒TTL；若支持多页，要先列出修改影响的全部键。

2. **实现可替换缓存层 · 50 分钟**

   - 为列表读取拆出缓存接口，命中时解码，未命中时查数据库并尝试回填。
   - Redis连接错误、超时或坏JSON都回源；数据库自身错误仍返回明确失败，不能把它变成空列表。
   - 缓存写失败只记录脱敏警告，不让成功的数据库读请求失败。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

3. **安排更新与失效 · 40 分钟**

   - 设备更新先完成MySQL提交，再删除相关缓存键；事务回滚时不让缓存代表未提交状态。
   - 固定单实例先演示更新后再次读取；写出读旧值、更新提交、删缓存、旧读回填这一交错。
   - 本阶段记录TTL限制与失效重试思路，强正确性读取可绕过缓存；不要把Redis锁代替数据库预约约束。

4. **验证三条路径 · 35 分钟**

   - 增加hit、miss、fallback计数或日志，分别请求首次、再次与Redis不可达场景。
   - 更新一条虚构设备后核对数据库和列表；只使用自己的测试账号，不缓存登录凭证或用户预约详情。

   ```text
   cd ~/projects/lab-booking
   curl -i 'http://127.0.0.1:8081/devices?page=1&page_size=10'
   ```

5. **整理限制与回归 · 25 分钟**

   - 运行列表和预约测试，确认原预约事务代码仍执行。
   - README写明缓存范围、TTL、失效时机和并发陈旧窗口；把可观测字段与后续测量脚本对应。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   go test -race ./...
   ```

**完成后逐项验收**

- 连续两次请求分别出现miss与hit，响应内容一致。
- Redis不可达时设备列表成功回源，超时有上限。
- 普通顺序修改后下一次查询得到新设备值。
- 不同分页参数不会错用同一缓存条目。
- 预约冲突测试仍依赖MySQL事务通过。

**保留的学习产物**

- 缓存层实现与路径图。
- 失效、TTL和并发陈旧边界说明。

**问题排查**

- 修改后删键却仍读到旧值：重现慢读回填交错；记录最终一致性，缩短TTL或绕过缓存，后续再评估版本键/可靠失效。
- Redis坏数据导致500：识别解码失败并删本任务缓存键、回源，给修复行为加日志，不覆盖数据库错误。

**复盘问题**

- 哪些字段放进键才能避免串页或串筛选？
- 为什么先删缓存再提交数据库更容易回填旧值？

**参考资料**

- [李文周：Redis 与 Go](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：Redis 与 Go](https://liwenzhou.com/posts/go/golang-menu/)
- [Redis 官方：Go 客户端与超时](https://redis.io/docs/latest/develop/clients/go/)

**可选延伸（从已有预算中调配时间）**

- 预算内从文档步骤挪10分钟讨论设备版本键，先画时序不加入未经验证的实现。

### w09-t03 · 测试缓存过期、失效与故障（180 分钟）

操作：补缓存命中、过期、设备修改、Redis 不可用测试；解释穿透、击穿、雪崩各一个场景，只为已出现的问题选择措施。验收：缓存故障不阻止设备查询，测试能揭示一处错误的失效时机。

**学习目标：** 用可控测试验证缓存命中、TTL到期、更新失效和故障回源，区分穿透、击穿、雪崩，先修出现过的边界而非堆砌缓存方案。

**开始前确认**

- 缓存读写分支已拆开，测试可注入假缓存。
- 使用独立测试库和lab-booking:test:w09键前缀。

**操作步骤**

1. **列出行为矩阵 · 30 分钟**

   - 画四行测试表：命中不查库、未命中查库、坏缓存回源、Redis超时回源，给每行写期望调用次数。
   - 补一行数据库失败应返回错误；预约提交测试不把缓存读成功作为成功条件。

2. **隔离单元测试 · 50 分钟**

   - 假缓存显式返回命中、redis.Nil、超时与坏JSON，断言服务返回值和存储调用次数。
   - 用可注入时钟或过期状态完成逻辑测试，避免每条单测都固定sleep导致慢且不稳定。
   - 挑一条先失败的测试确认错误失效时机，再修改代码并重跑。

   ```text
   cd ~/projects/lab-booking
   go test ./... -count=1
   ```

3. **验证真实Redis TTL · 35 分钟**

   - 集成测试使用专属键和短TTL，在有上限的轮询中等到键消失，只清理自己创建的键。
   - 测试提交成功后失效、事务失败时列表不暴露新值，把真实数据库状态和缓存值同时保存。

4. **制造并发与服务故障 · 40 分钟**

   - 用可控通道延迟一次旧列表读取，安排更新提交及删除，再让旧读回填，观察陈旧窗口。
   - 让缓存地址指向未监听端口验证回源；不要停止共享Redis或执行FLUSHALL。
   - 按场景解释不存在ID反复查询是穿透、单热点过期是击穿、多键同刻到期是雪崩，标注目前是否出现。

   ```text
   cd ~/projects/lab-booking
   go test -race ./...
   ```

5. **留证与归因 · 25 分钟**

   - 保存测试名称、环境和失败/修复输出，为实际出现的问题选择一项小修复。
   - 若并发一致性尚未解决，写明测试揭示的限制与安全绕过路径，不删掉失败场景或声称强一致。

   ```text
   cd ~/projects/lab-booking
   go vet ./...
   ```

**完成后逐项验收**

- 至少覆盖命中、未命中、超时、坏JSON和数据库失败五种分支。
- 实际Redis键到期可在限时轮询内观察。
- 提交成功与回滚场景分别检查缓存更新行为。
- 并发旧值回填有可重复时序或明确的已验证修复。

**保留的学习产物**

- 缓存测试文件及独立集成测试说明。
- 一次失效时机错误的复现与修复记录。

**问题排查**

- 测试TTL偶尔失败：采用截止时间内轮询并留足调度余量，单元测试注入时钟；不要只延长sleep掩盖问题。
- 假缓存测试通过但真实服务失败：检查客户端错误类型、超时与JSON编码，新增一条最小真实Redis集成验证。

**复盘问题**

- 哪个失败证明了测试确实能保护失效顺序？
- 缓存故障会给MySQL带来什么负载变化？

**参考资料**

- [李文周：Redis 与单元测试](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：Redis 与单元测试](https://liwenzhou.com/posts/go/golang-menu/)
- [Redis 官方：Go 客户端与超时](https://redis.io/docs/latest/develop/clients/go/)

**可选延伸（从已有预算中调配时间）**

- 从总结步骤挪10分钟给测试TTL加入小随机抖动讨论，未出现雪崩时不扩实现。

### w09-t04 · 测量缓存收益并记录限制（180 分钟）

操作：使用第 8 周脚本在相同环境比较缓存关闭与开启，记录命中率、数据库查询次数、耗时和失败率；写一页结果。验收：结果可重跑，解释收益与失效风险，未见提升时如实保留结论并查原因。

**学习目标：** 在相同WSL资源和数据集下比较缓存开关，得到可复跑的命中率、SQL次数、时延与失败率，诚实判断收益和代价。

**开始前确认**

- 第8周请求脚本能记录单请求耗时与错误。
- 缓存有hit/miss/fallback和数据库查询计数，测试合成数据固定。

**操作步骤**

1. **固定测量条件 · 30 分钟**

   - 记下Ubuntu24.04、Go版本、CPU/内存、设备条数、SQL索引、TTL和提交号。
   - 写清并发1/10/30、预热请求数与正式请求数，关闭其他主动压测；认证和分页参数保持一致。

   ```text
   cd ~/projects/lab-booking
   go version
   git rev-parse HEAD
   ```

2. **取得关闭缓存基线 · 40 分钟**

   - 使用明确配置关闭缓存，运行相同设备列表读取三轮，保存原始逐请求结果和SQL计数。
   - 每轮重置自己新增的计数，保留失败请求类型；不要为了好看剔除超时。

3. **测冷缓存与热缓存 · 45 分钟**

   - 仅删除已知测试缓存键获取冷启动，再按固定请求数预热后测热缓存三轮。
   - 记录命中、未命中、回源、成功与失败总数，核对这些数与请求数关系。
   - 保证缓存TTL没有在两组实验中形成未记录的变量，注明测试期间是否发生到期。

4. **分析数据与风险 · 40 分钟**

   - 用原始数据计算中位数、p95与失败率；写清样本量和分位数方法，小样本不声称稳定p99。
   - 对比数据库查询次数及客户端耗时，挑一次慢请求以请求ID关联日志。
   - 没有提升时检查本机网络开销、JSON编码和数据量，保留真实结论；同时列出修改后陈旧窗口与Redis停机风险。

5. **输出可复跑结果 · 25 分钟**

   - 把环境、步骤、原始文件路径、结果表和限制写成一页测量说明。
   - 用这份记录核对简历描述，只有已测到的数值才能使用，并给出条件；不把本机性能推算成真实用户规模。

   ```text
   cd ~/projects/lab-booking
   git diff --check
   ```

**完成后逐项验收**

- 缓存开关两组使用同一数据、并发与请求数量。
- 每组三轮原始结果可核对命中率、SQL次数和失败率。
- p95来自保存的请求样本，计算口径已写明。
- 结论包含收益或无收益及一致性、回源限制。

**保留的学习产物**

- 请求原始结果与可重跑脚本。
- 一页缓存对比报告。

**问题排查**

- SQL计数下降但响应更慢：按日志分解Redis往返与序列化时间，检查数据规模，不强行把缓存标为优化成功。
- 第一轮和后续轮差异很大：拆分冷启动、预热和正式测量，控制缓存到期与后台进程，报告各轮而非挑最佳轮。

**复盘问题**

- 这次变化来自缓存还是环境扰动，有哪些证据？
- Redis故障时回源失败率和数据库负载会怎样？

**参考资料**

- [Go by Example：计时与 HTTP 客户端](https://gobyexample-cn.github.io/)
- [Go by Example：计时与 HTTP 客户端](https://gobyexample-cn.github.io/)
- [Redis 官方：Go 客户端与超时](https://redis.io/docs/latest/develop/clients/go/)

**可选延伸（从已有预算中调配时间）**

- 提前完成时从报告步骤挪10分钟追加Redis不可达测量，继续复用相同请求数。

### w09-t05 · 内存、分页与 Linux 资源观测（150 分钟）

操作：使用 free、top、du 观察 Go、MySQL、Redis 的内存与磁盘，阅读虚拟内存、分页、缓存的基本概念；给数据库列表加合理分页。验收：能解释内存占用与磁盘空间不同，分页不会一次返回全部记录。

**学习目标：** 把内存、虚拟内存、分页与磁盘空间关联到WSL里真实的进程观测，并为设备列表限制单次查询和返回规模。

**开始前确认**

- 本机Go、MySQL、Redis学习服务可运行。
- 设备列表已有缓存，分页修改需要同时调整缓存键。

**操作步骤**

1. **观察资源而不清理 · 30 分钟**

   - 在WSL内记录总内存、可用内存、swap以及项目目录磁盘大小，区分free输出与du的单位。
   - 用top找到Go、MySQL、Redis，记下RSS相关数值和观测时间；这些只是采样，不是永久资源需求。

   ```text
   cd ~/projects/lab-booking
   free -h
   top
   du -sh .
   ```

2. **建立概念对应 · 30 分钟**

   - 用一页图解释虚拟地址、物理页、页缓存、swap和磁盘文件，标出哪些值当前工具能看到。
   - 比较运行前后可用内存，不用单个used数值断言泄漏，也不执行清理内核缓存命令来追求整齐结果。

3. **设计可预测分页 · 40 分钟**

   - 确定默认页码、默认条数与最大条数，对负数、非法字符串、超大page_size返回明确错误或有文档的限制。
   - 查询使用稳定ORDER BY与LIMIT/OFFSET，说明大offset有成本；响应包含分页信息，空页仍返回空数组。
   - 将页码、大小和筛选纳入缓存键，管理员修改必须失效当前缓存范围，不能只删第一页。

4. **验证边界与资源 · 30 分钟**

   - 用合成设备记录请求首页、第二页、空页及超上限条数，确认页间不重复且排序稳定。
   - 对比一次性返回与分页返回的体积，不为实验生成超出机器承受的大数据；保留相同数据库条件。

   ```text
   cd ~/projects/lab-booking
   curl -i 'http://127.0.0.1:8081/devices?page=2&page_size=10'
   ```

5. **检查回归与解释 · 20 分钟**

   - 运行列表测试并在README写分页范围，注明并发插入可能影响offset分页。
   - 将资源采样与分页结果对应，解释减少单次返回并不等于解决所有数据库性能问题。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

**完成后逐项验收**

- 能解释free的available与du统计文件空间的区别。
- 页大小有上限，非法参数有固定响应。
- 稳定数据集分页无重复、空页格式正确。
- 第二页缓存不复用第一页，修改后的失效范围有记录。

**保留的学习产物**

- 资源采样与内存概念图。
- 分页接口、边界测试和接口文档。

**问题排查**

- WSL内存数字与Windows任务管理器不同：标明测量边界与WSL虚拟机资源，避免把宿主机与发行版视为同一统计口径。
- 翻页顺序变化或重复：给查询加稳定排序及ID作为同值排序补充；记录offset在并发写入下的限制。

**复盘问题**

- 为什么页缓存占用内存不一定意味着可用内存不足？
- 分页后的缓存失效为何比单个全量键复杂？

**参考资料**

- [缺失的一课：性能分析与工具](https://missing-semester-cn.github.io/)
- [缺失的一课：性能分析与工具](https://missing-semester-cn.github.io/)
- [Redis 官方：Go 客户端与超时](https://redis.io/docs/latest/develop/clients/go/)
- [Redis 官方：EXPIRE 与 TTL](https://redis.io/docs/latest/commands/expire/)

**可选延伸（从已有预算中调配时间）**

- 从概念阅读挪10分钟讨论游标分页，仅写场景比较，不增加实现范围。

### w09-t06 · 堆与 Top K 练习（150 分钟）

操作：学习 container/heap 的接口，完成 Top K 高频元素；再写一道栈或队列旧题检查遗忘。验收：能解释为什么堆可把复杂度降到 O(n log k)，补齐 k=0 和 k 超界处理。

**学习目标：** 用Go标准库的小顶堆解决Top K频率问题，准确区分元素数、不同值数量与k，并回练一道栈或队列旧题。

**开始前确认**

- 已写过map计数和栈/队列，熟悉切片基本操作。
- 在lab-booking练习子目录或contacts练习目录编码，不改业务接口。

**操作步骤**

1. **画出堆的行为 · 25 分钟**

   - 用六个虚构整数手算频率，把不同值与频率配对；解释堆顶保留最小频率。
   - 阅读container/heap接口，写明Len、Less、Swap、Push、Pop分别由谁调用；保留一个插入后的树形草图。

2. **搭起最小堆练习 · 35 分钟**

   - 实现只包含值与次数的堆类型，先验证三个Push和Pop顺序，不直接复制完整Top K答案。
   - 注意接口Push/Pop操作底层切片末尾，而heap.Pop负责调整堆结构；用短测试检验长度变化。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

3. **完成Top K与复杂度 · 40 分钟**

   - 先计数，再维持大小不超过k的堆；说明相同频率时是否要求稳定顺序。
   - 明确k=0、负数和k超过不同值数的约定，写入函数注释并做边界测试。
   - 设输入长度n、不同值数m，写计数O(n)与堆O(m log k)，不要把所有方法笼统说成O(n log k)。

4. **回练一题与对照 · 30 分钟**

   - 从有效括号或队列题选一道，不看原代码用15分钟重写，再用15分钟测试空输入和错误次序。
   - 比较新旧代码，把忘掉的Go语法与算法思路分别记录；Top K结果按集合或约定排序验收。

5. **复述和收尾 · 20 分钟**

   - 不用资料讲清为什么只留k项比全部排序节省工作，指出k接近m时的取舍。
   - 保存测试与错因，不把练习题嵌入预约服务；本题超时则记录卡点并缩减可选延伸。

   ```text
   cd ~/projects/lab-booking
   git diff --check
   ```

**完成后逐项验收**

- Top K通过k=0、超界、全相同和并列频率用例。
- 解释heap.Pop与自定义Pop的职责区别。
- 复杂度使用n/m/k分别说明。
- 旧题能独立重写并留下至少一条错因。

**保留的学习产物**

- 堆与Top K练习代码、测试。
- 手算图和旧题错因卡。

**问题排查**

- Pop返回顺序不是最大频率：这是小顶堆；如输出要求排序，单独安排输出排序并计入复杂度。
- k超界出现空堆操作：先定义参数契约并在进入主循环前处理无效范围，测试不同值数小于k的输入。

**复盘问题**

- 什么时候全部排序更容易解释且足够合适？
- 为什么复杂度里的m不能总与n混用？

**参考资料**

- [Go by Example：接口与集合](https://gobyexample-cn.github.io/)
- [Go by Example：接口与集合](https://gobyexample-cn.github.io/)
- [Go标准库：container/heap接口](https://pkg.go.dev/container/heap)

**可选延伸（从已有预算中调配时间）**

- 主练习提前完成，从口述步骤挪10分钟阅读标准库heap示例，仅比较接口实现。

### w09-t07 · 复盘真实面试问题并继续投递（120 分钟）

操作：新投 5 个岗位并跟进已有流程；把真实面试或自测中不熟悉的 Go、MySQL、网络问题写成问答卡，最多选 5 个补齐。验收：每张卡有自己的解释或可运行例子，简历缓存指标来自保存的测量记录。

**学习目标：** 在120分钟内完成一轮有匹配依据的投递，并把最多五个真实面试或自测薄弱点转成能验证的问答卡。

**开始前确认**

- 已维护岗位表与一页简历，缓存报告保留原始数据。
- 岗位来源必须是公司招聘页面或已核实入口；没有面试时用自测题，不编造经历。

**操作步骤**

1. **核对状态和证据 · 20 分钟**

   - 更新岗位表：公司、岗位链接、查询日期、城市、技能、到岗日期、每周出勤、期限、状态、下一步日期。
   - 检查简历中的缓存数字能指向测量条件与原始结果；没有显著收益就写实现与验证，不造指标。

2. **筛选五个匹配机会 · 30 分钟**

   - 进入公司招聘页面确认岗位仍可申请，按Go/MySQL要求和研一课程安排记录匹配、差距和地点。
   - 优先北上广深杭可执行机会，写宜昌就读、实际可到岗日期及每周天数；没有五个匹配岗位就如实记录。

3. **投递并有限跟进 · 25 分钟**

   - 按各官方入口填写真实信息提交，记录日期、所用简历版本和反馈；不要重复投同一未更新职位。
   - 对已有流程查看邮件或平台状态，按约定时间跟进；未授权自动发送消息时只准备文字供自己发送。

4. **补齐问答卡 · 30 分钟**

   - 最多选五个问题，优先自己的真实错误：slice扩容、事务回滚、TCP与HTTP关系或缓存旧值回填。
   - 每张卡写原回答、错误原因、自己的修正版和一条代码/SQL/实验验证；卡片不直接粘贴标准答案。
   - 随机抽两张用90秒回答，讲清条件和不确定处，验证不懂的术语再加进卡片。

5. **安排下一动作 · 15 分钟**

   - 给每个活跃机会填下一步日期，缺失到岗条件标待询问，不假定公司允许远程或低出勤。
   - 保留两张卡的自测结果，把最多一个未补完问题移入下周，保证本任务不挤占休息。

**完成后逐项验收**

- 岗位表含五个新投或实际可跟进机会，不足时记录原因。
- 每次投递有官网链接、日期和简历版本。
- 最多五张卡各有自己解释与验证证据。
- 简历每个缓存数字可追到原始测量。

**保留的学习产物**

- 更新的岗位/投递表和简历版本。
- 面试薄弱点问答卡。

**问题排查**

- 招聘转载页面与官网要求不一致：以公司正式页面和沟通结果为准，记录查询日期，不声称计划里列的岗位当前在招。
- 背得出术语却说不清实验：从自己请求日志或SQL出发重讲，删掉无证据的性能与职责描述。

**复盘问题**

- 投递少反馈是匹配、表达还是渠道问题，哪些证据支持判断？
- 哪张卡修正了一个会影响项目正确性的误解？

**参考资料**

- [Redis 官方：Go 客户端与超时](https://redis.io/docs/latest/develop/clients/go/)

**可选延伸（从已有预算中调配时间）**

- 若筛选提前完成，从末步挪10分钟录一段缓存设计回答，保持120分钟总额。

### w09-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟复盘缓存收益和一个一致性边界，确定容器化所需配置；30 分钟离屏活动。验收：记录实际时长、缓存限制与下周部署清单。

**学习目标：** 用30分钟形成缓存阶段的真实复盘与容器化准备清单，再完整安排30分钟离屏恢复精力，保持每周20小时。

**开始前确认**

- 本周缓存实现、测试、测量和投递记录可查看。
- 未完成内容允许重新排优先级，不用熬夜补齐所有勾选。

**操作步骤**

1. **证据复盘与下周准备 · 30 分钟**

   - 用前10分钟核对八项任务的实际用时与产物，记录已完成、部分完成、阻塞原因各一项，未实测数据不得写成成果。
   - 用中间10分钟回看缓存开关结果与一次一致性边界，写五句复盘：目标、现象、证据、解释、下步；特别注明旧值回填与Redis故障回源。
   - 用最后10分钟列容器化所需Go入口、HTTP端口、数据库名、迁移路径、Redis配置和数据卷需求；真实密码只写变量名。挑三项下周重点，延期项替换同等时间内容。

2. **主动休息与结束记录 · 30 分钟**

   - 先设30分钟提醒并离开电脑，散步或舒缓伸展；不用手机刷教程或继续整理简历，把这段当作计划内恢复时间。
   - 结束后只记开始结束时间和身体状态；若仍疲惫，下周减少可选延伸，核心优先保证预约正确性和可复现。
   - 为下一次学习标一条清晰入口，例如先检查Docker现有版本和使用路线；不在休息结束后临时展开新任务。

**完成后逐项验收**

- 复盘包含五句事实说明和本周实际分钟数。
- 记录一个缓存收益结论及一个未解决的一致性边界。
- 容器化清单至少含入口、端口、迁移与配置变量。
- 30分钟离屏有开始结束记录，下周预算仍为1200分钟。

**保留的学习产物**

- 本周复盘与实际用时表。
- 容器化准备清单和延期调整记录。

**问题排查**

- 任务拖延导致复盘变成继续编码：将当前状态、错误信息和下一条命令记下即停止；从下周可选范围换时间，不占离屏30分钟。
- 缓存报告只有漂亮数字没有条件：回链原始样本、数据规模与并发数；无法核对就降为未验证结论，避免写进简历。

**复盘问题**

- 本周哪项收益足以支持保留缓存，哪项限制必须向使用者说明？
- 下周最需要容器化解决的是安装差异还是配置和启动顺序？

**参考资料**

- [Redis 官方：EXPIRE 与 TTL](https://redis.io/docs/latest/commands/expire/)

**可选延伸（从已有预算中调配时间）**

- 可从复盘30分钟内挪5分钟手画容器关系草图；不得增加总时长或减少离屏时间。

## 第 10 周：用 Docker 在本机复现运行环境

目标：把 Go、MySQL、Redis 的启动条件写进容器配置，让新环境能重现项目。

### w10-t01 · 理解镜像、容器与多阶段构建（180 分钟）

操作：在 Ubuntu 本机使用 Docker，检查版本，编写 Go 多阶段 Dockerfile，使用非 root 用户运行；比较源码、编译产物与运行镜像。验收：docker build 后能启动 /health，能解释镜像、容器、端口映射各自含义。

**学习目标：** 把预约API编译成可说明构建与运行差异的镜像，在本机回环端口启动并使用非root身份；先检测已有Docker路线再选择安装。

**开始前确认**

- Ubuntu24.04的caolingyun可运行lab-booking，知道Go入口位置。
- Go/Git/VSCode已装好；镜像使用与项目go.mod兼容且明确固定的Go版本。

**操作步骤**

1. **检查Docker与WSL路线 · 30 分钟**

   - Windows 终端确认当前发行版是 WSL2；Ubuntu 内检查 Docker 版本、context 与 PID 1。本机 Ubuntu-24.04 已启用 systemd，其他电脑应重新核实。
   - 已有Docker Desktop就开启对应发行版WSL集成并复用；若选WSL内Engine则按Ubuntu官方路线安装。两种只选一种，避免双daemon混用。
   - 缺版本才按官方路线安装；Engine若需启用systemd，先保存工作，说明重启WSL会停止TodoList与数据库，再依WSL官方步骤处理；不开放daemon端口。

   ```text
   # Windows PowerShell 中执行
   wsl --list --verbose
   # 以下在 Ubuntu24.04 终端中执行
   cd ~/projects/lab-booking
   docker version
   docker context ls
   docker compose version
   ps -p 1 -o comm=
   ```

2. **规划构建上下文 · 25 分钟**

   - 查Go程序实际入口、是否依赖CGO、时区与证书；不要假定所有程序都能在scratch运行。
   - 编写.dockerignore排除.git、个人配置、profile和本机二进制，Go源码与依赖锁文件保留。

3. **完成多阶段Dockerfile · 55 分钟**

   - 构建阶段先复制go.mod/go.sum下载依赖，再复制源码并编译；按真实入口修改build命令。
   - 运行阶段仅复制二进制及必要资源，创建非root用户并设置WORKDIR，不把数据库密码写进ARG或ENV。
   - 先选择便于排错的发行版运行镜像，说明镜像包含什么以及为何不携带整个Go编译器。

   ```text
   cd ~/projects/lab-booking
   docker build -t lab-booking:study-w10 .
   ```

4. **启动与检查身份 · 45 分钟**

   - 示例统一容器端口8081。先核对项目监听配置名，本文用APP_ADDR示范，按自己的代码调整；设0.0.0.0:8081，宿主仅发布127.0.0.1:18080。
   - 查看日志与容器配置核对用户，访问/health；若健康依赖MySQL，明确接入已准备学习库的方式。

   ```text
   cd ~/projects/lab-booking
   docker run --name lab-booking-w10 -e APP_ADDR=0.0.0.0:8081 -p 127.0.0.1:18080:8081 lab-booking:study-w10
   curl -i http://127.0.0.1:18080/health
   ```

5. **说明与收尾 · 25 分钟**

   - 记录构建时长、镜像大小和运行身份，解释-p左右分别为宿主与容器端口。
   - 保存失败和修复线索，只停止自己创建的容器，不清理其他镜像或volume；下一任务再接完整Compose。

   ```text
   cd ~/projects/lab-booking
   docker stop lab-booking-w10
   ```

**完成后逐项验收**

- 检测记录能指出Desktop或WSL Engine中的唯一选用路线。
- Dockerfile含构建/运行两个阶段，秘密不进镜像。
- 镜像构建通过，运行配置使用非root身份。
- 回环端口的/health可访问，镜像与容器区别可口述。

**保留的学习产物**

- Dockerfile与.dockerignore。
- 版本、context和本机运行记录。

**问题排查**

- docker客户端存在但连接不到daemon：核对context和Desktop WSL集成或所选Engine状态；不要另装第二套daemon碰运气。
- 容器启动却宿主curl失败：服务需在容器内监听0.0.0.0，宿主发布仍用127.0.0.1；检查程序端口与-p映射。

**复盘问题**

- 多阶段构建减少了哪些运行时内容？
- 非root容器为什么仍需要合理的文件权限和隔离？

**参考资料**

- [李文周：Docker 与 Go 部署条目](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：Docker 与 Go 部署条目](https://liwenzhou.com/posts/go/golang-menu/)
- [Docker 官方：WSL 2 后端](https://docs.docker.com/desktop/features/wsl/)
- [Docker 官方：Compose 启停顺序](https://docs.docker.com/compose/how-tos/startup-order/)

**可选延伸（从已有预算中调配时间）**

- 主任务提前完成，从收尾步骤挪10分钟比较两次构建缓存命中，不扩大镜像优化范围。

### w10-t02 · 编写本机 Compose 服务配置（180 分钟）

操作：配置 Go、MySQL、Redis 服务、数据卷、网络与健康检查，端口仅发布到 127.0.0.1；使用配置示例说明启动与迁移顺序。验收：新目录中按 README 能启动完整预约流程，容器内数据库地址使用服务名。

**学习目标：** 用Compose v2描述Go、MySQL、Redis网络、健康检查与持久化，在隔离的本机项目中复现登录和预约，避免宿主地址误用。

**开始前确认**

- Docker单一路线可用，多阶段镜像构建成功。
- 迁移脚本与合成演示数据已有，知道应用配置变量名。

**操作步骤**

1. **列清服务契约 · 30 分钟**

   - 确定app、db、redis服务名。示例app容器8081，监听设0.0.0.0:8081并核对实际配置名（示例APP_ADDR）；依赖使用db:3306与redis:6379。
   - 数据卷使用本项目明确命名，宿主只发布应用127.0.0.1:18080；数据库与Redis无需公开宿主端口。
   - 建立.env.example并忽略真实.env，记录Compose变量替换与容器环境注入的区别。

2. **编写Compose文件 · 50 分钟**

   - 使用compose.yaml、services和现代docker compose命令，不抄旧version字段与docker-compose二进制说明。
   - 配置MySQL健康检查、应用等待健康依赖和Redis健康检查；Redis是可选缓存，运行时失败仍回源。
   - 为app提供服务名配置、非root镜像与明确重启策略，给MySQL挂独立named volume，不把开发目录全部挂进运行镜像。

   ```text
   cd ~/projects/lab-booking
   docker compose config --quiet
   ```

3. **启动与迁移 · 40 分钟**

   - 用学习项目名启动，观察db由starting到healthy；健康不等于表已建，迁移必须单独有明确步骤。
   - 按自己的迁移工具或SQL脚本创建表与演示数据，再启动/检查应用；避免把数据库初始化脚本当作每次升级迁移。

   ```text
   cd ~/projects/lab-booking
   docker compose up -d --build
   docker compose ps
   ```

4. **验证业务与地址 · 35 分钟**

   - 在宿主回环端口完成演示用户登录、预约与管理员管理，核对MySQL新增行。
   - 检查容器内使用服务名，解释容器localhost指向自己；记录实际Compose网络名与volume归属。

   ```text
   cd ~/projects/lab-booking
   docker compose logs --tail 80 app db
   ```

5. **写复现说明 · 25 分钟**

   - README写配置、启动、迁移、健康检查、演示和停止的顺序；显示日志前确认没有连接串密码。
   - 新目录验证时用不同Compose项目名及回环端口防止撞上原项目，只创建测试volume，停止后保留数据卷。

   ```text
   cd ~/projects/lab-booking
   docker compose stop
   ```

**完成后逐项验收**

- docker compose config --quiet通过，使用v2命令。
- 容器依赖地址为db与redis服务名。
- 数据库健康之后执行迁移，完整预约流程成功。
- 宿主只公开回环应用端口，volume归属清楚。

**保留的学习产物**

- compose.yaml、环境变量样例。
- 从配置到迁移和预约的复现说明。

**问题排查**

- 健康检查通过却提示表不存在：healthcheck只证明服务准备状态；确认迁移库名与应用库名一致，执行版本化迁移。
- 容器用127.0.0.1连接数据库失败：改成Compose服务名并用容器端口，检查两服务处于同一Compose网络。

**复盘问题**

- 为什么depends_on不能替代应用运行时连接错误处理？
- 初始化SQL与后续迁移分别在何时执行？

**参考资料**

- [李文周：Docker 部署](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：Docker 部署](https://liwenzhou.com/posts/go/golang-menu/)
- [Docker 官方：Compose 启停顺序](https://docs.docker.com/compose/how-tos/startup-order/)
- [Docker 官方：Compose 网络](https://docs.docker.com/compose/how-tos/networking/)

**可选延伸（从已有预算中调配时间）**

- 从文档步骤挪10分钟补依赖拓扑图，不增加新的服务或外部部署。

### w10-t03 · 验证持久化、配置与重启行为（180 分钟）

操作：新增预约后重启应用与数据库容器，检查数据卷；模拟 MySQL 尚未准备、Redis 不可用与错误配置。验收：正常重启数据保留，故障日志能指出原因，明确删除数据卷会清空学习数据。

**学习目标：** 证明学习volume在正常重启后保留预约，并验证依赖未准备、Redis不可用和错误配置的可诊断行为；理解重启与删除数据的不同。

**开始前确认**

- Compose服务与迁移已通过，演示数据不是个人真实信息。
- 已记录本项目名、数据库volume和当前预约ID。

**操作步骤**

1. **建持久化基线 · 30 分钟**

   - 通过API创建一个虚构预约，记录ID、状态与数据库行；列出本项目volume实际名称。
   - 确认MySQL数据目录挂到named volume，应用配置和迁移脚本只读或进入镜像，不依赖临时容器层。

   ```text
   cd ~/projects/lab-booking
   docker compose ps
   docker volume ls
   ```

2. **验证正常重启 · 40 分钟**

   - 先重启app再请求预约列表，随后重启db并等待健康恢复，核对同一预约ID。
   - 记录停机短窗口的API结果和恢复耗时；区分连接断开、服务不可用与数据真正丢失。

   ```text
   cd ~/projects/lab-booking
   docker compose restart app
   docker compose restart db
   ```

3. **验证启动与错误配置 · 45 分钟**

   - 在独立测试配置中模拟数据库尚未健康，观察Compose依赖与应用有限重试；给最大等待时间，不能无限挂起。
   - 让一个非敏感库名或地址错误，记录错误类别与修复过程；使用单独override文件避免破坏常用配置。
   - 数据库初始化变量只影响空数据目录，已有volume时改密码变量不会自动改账户，写入限制说明。

4. **验证Redis停机回源 · 40 分钟**

   - 仅停止本项目redis，重复设备列表查询与预约，核对回源日志和超时上限。
   - 恢复redis后检查健康与缓存重建；预约正确性由MySQL保护，Redis不可用不应让冲突预约都成功。

   ```text
   cd ~/projects/lab-booking
   docker compose stop redis
   docker compose start redis
   ```

5. **形成恢复说明 · 25 分钟**

   - 整理正常重启、依赖未准备、缓存故障、错配置四行表，写现象、原因、检查与恢复动作。
   - 明确down通常保留named volume，而down -v会删除数据；本任务仅说明危险，不执行删volume、prune或删除其他用户数据。

   ```text
   cd ~/projects/lab-booking
   docker compose logs --tail 100 app db redis
   ```

**完成后逐项验收**

- app和db分别重启后同一预约ID仍存在。
- MySQL未准备时失败或有限重试行为清楚。
- Redis停止后列表回源成功且冲突检查仍有效。
- 错误配置日志可定位，不输出密码。
- 文档明确volume名称、数据保存边界和禁删范围。

**保留的学习产物**

- 持久化与故障验证记录。
- 恢复步骤和配置override说明。

**问题排查**

- 改MYSQL_PASSWORD后旧volume仍无法登录：既有数据目录保留原账户；核对学习用户设置，按受控账户变更流程处理，不删卷绕过。
- 数据库重启后app长时间不恢复：检查连接池失效连接、请求超时与重试策略，记录错误再修复，不反复重启整个栈。

**复盘问题**

- 哪些数据在容器层，哪些必须位于volume？
- 为什么缓存恢复不应该改变预约事务结果？

**参考资料**

- [李文周：部署与数据库](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：部署与数据库](https://liwenzhou.com/posts/go/golang-menu/)
- [Docker 官方：Compose 启停顺序](https://docs.docker.com/compose/how-tos/startup-order/)
- [Docker 官方：Compose 网络](https://docs.docker.com/compose/how-tos/networking/)

**可选延伸（从已有预算中调配时间）**

- 若有余量，从总结步骤挪10分钟阅读数据库备份流程，仅为学习卷写备份计划。

### w10-t04 · 完善优雅停止和回归测试（180 分钟）

操作：处理 SIGINT/SIGTERM，用 http.Server.Shutdown 等待请求结束并关闭连接；重新运行单测、竞态检测和预约并发测试。验收：停止服务不会留下未提交事务，保存测试命令与结果，容器停止日志可解释。

**学习目标：** 让SIGINT/SIGTERM触发有限时优雅停止，等待已有HTTP请求、取消未完工作并关闭连接，再确认预约并发正确性与容器停止行为。

**开始前确认**

- HTTP服务有Context与数据库事务，容器启动成功。
- 已有并发预约测试和独立测试库，知道事务提交或回滚路径。

**操作步骤**

1. **画停止时间线 · 30 分钟**

   - 区分停止接受新请求、等待进行中请求、超时取消和关闭连接四步，设例如10秒应用退出预算。
   - 核对Docker停止宽限期大于应用预算，讨论http.Server.Shutdown不自动结束所有自建goroutine。

2. **连接信号与Server · 50 分钟**

   - 通过signal.NotifyContext接SIGINT/SIGTERM，保存明确http.Server实例，避免只依赖便捷启动函数。
   - 信号后使用独立超时Context调用Shutdown，正常关闭不作为异常fatal；接着关闭自己拥有的DB与Redis客户端。
   - 为后台goroutine准备取消与等待，确保处理中的事务在返回前Commit或Rollback，不把退出时全部强行提交当作安全。

3. **测试在途请求 · 35 分钟**

   - 仅对合成测试请求增加可控短延迟，开始请求后发送终止信号，观察请求能在预算内结束。
   - 另测超出宽限期的请求，核对取消、事务回滚与退出日志；去掉临时演示延迟再验收。

   ```text
   cd ~/projects/lab-booking
   docker compose stop -t 15 app
   ```

4. **执行业务回归 · 40 分钟**

   - 运行单元、竞态与vet，再在独立库发送同设备同时间并发预约，核对最多一个成功。
   - 停止过程中查询最终数据库状态，确保没有半条业务写入与悬挂事务；记录MySQL连接是否归还。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   go test -race ./...
   go vet ./...
   ```

5. **解释容器退出 · 25 分钟**

   - 核对Dockerfile使用exec形式入口，确认Go进程能收到信号；保留容器退出码与两条关键日志。
   - README说明应用/容器两个时间预算，列出长连接或后台任务尚未覆盖的限制。

   ```text
   cd ~/projects/lab-booking
   docker compose logs --tail 100 app
   ```

**完成后逐项验收**

- SIGTERM能触发Shutdown且日志明确。
- 短在途请求正常结束，超时请求有可解释结果。
- 事务失败/取消时回滚，退出后无半完成预约。
- 单测、竞态与并发预约回归结果保留。
- 容器宽限期与应用退出预算有文档。

**保留的学习产物**

- 信号与停止实现及验证记录。
- 回归结果和退出时序说明。

**问题排查**

- docker stop直接超时强杀：检查shell形式ENTRYPOINT导致信号未传到Go，改exec形式并匹配停止预算。
- Shutdown结束但后台任务仍跑：给自建goroutine传取消Context并等待退出，避免关闭数据库后还发查询。

**复盘问题**

- 为什么关DB应在等待在途处理之后？
- 请求被取消后谁负责保证事务回滚？

**参考资料**

- [Go by Example：信号与 HTTP 服务](https://gobyexample-cn.github.io/)
- [Go by Example：信号与 HTTP 服务](https://gobyexample-cn.github.io/)
- [Docker 官方：Compose 启停顺序](https://docs.docker.com/compose/how-tos/startup-order/)
- [Docker 官方：Compose 网络](https://docs.docker.com/compose/how-tos/networking/)

**可选延伸（从已有预算中调配时间）**

- 从说明步骤挪10分钟补一条后台任务退出测试，前提是项目确有该任务。

### w10-t05 · Linux 容器日志、网络与文件权限（150 分钟）

操作：练习 docker logs、exec、inspect、compose ps，重现宿主机端口冲突、容器 DNS 错误、挂载目录不可写三个问题。验收：每类问题留下定位命令、根因和修复，不通过永久开放所有权限解决。

**学习目标：** 在150分钟内用日志、网络配置和文件权限定位三种容器故障，留下根因与恢复证据，不以永久开放权限或删除数据解决。

**开始前确认**

- Compose栈可运行，知道应用/数据库/Redis容器名。
- 全部故障只在独立练习项目与合成数据中制造。

**操作步骤**

1. **建立正常检查顺序 · 25 分钟**

   - 先核对compose ps、app日志、宿主curl，再查看容器端口和网络，写一条正常路径作为基线。
   - 用inspect只查询网络或挂载等所需字段；完整输出可能含秘密环境变量，不能直接放入笔记或Git。

   ```text
   cd ~/projects/lab-booking
   docker compose ps
   docker compose logs --tail 50 app
   ```

2. **排查宿主端口冲突 · 30 分钟**

   - 在自己的练习服务中占用学习回环端口，再启动Compose观察绑定错误。
   - 用ss定位监听进程并核对归属，停止自己创建的占用者或改学习端口；不要杀不明进程。

   ```text
   cd ~/projects/lab-booking
   ss -lntp
   ```

3. **排查容器DNS错误 · 35 分钟**

   - 在临时override中把db服务名拼错，重现解析错误并保存脱敏日志。
   - 检查Compose服务名与网络，镜像有getent才用它解析；没有就依据服务配置和错误信息，别假定精简镜像有所有工具。
   - 恢复服务名，验证容器内访问的是db:3306而非宿主映射端口。

   ```text
   cd ~/projects/lab-booking
   docker compose exec app id
   ```

4. **排查挂载不可写 · 35 分钟**

   - 创建仅属于自己的日志练习目录，以明确的UID/GID挂给非root容器，重现permission denied。
   - 分别查看宿主ls -ld与容器id，修改目标目录归属或最小需要的权限；不执行chmod 777，更不递归修改用户主目录。
   - Docker Desktop和Engine的挂载表现可能不同，把所选路线写进结果。

   ```text
   cd ~/projects/lab-booking
   ls -ld ./tmp
   ```

5. **验证恢复与记录 · 25 分钟**

   - 恢复三个临时改动，运行健康端点与预约流程，确认没有遗留错误override。
   - 每故障写现象、检查命令、证据、根因、修复和防复发各一句，记录花费分钟数与尚不清楚之处。

   ```text
   cd ~/projects/lab-booking
   curl -i http://127.0.0.1:18080/health
   ```

**完成后逐项验收**

- 端口冲突、DNS错误、挂载权限三类各有复现记录。
- 检查证据能指向实际根因而非猜测。
- 恢复后健康接口和预约仍可用。
- 没有公开远程端口、删volume或永久全开放权限。

**保留的学习产物**

- 三行以上容器排错表。
- 脱敏日志与恢复验证记录。

**问题排查**

- docker exec命令提示找不到shell或工具：精简镜像可能没有bash/ss；先查镜像内容，优先用logs、Compose配置和宿主工具验证。
- 改权限仍不可写：核对挂载是否只读、路径实际来源和UID/GID；修目标目录，不盲目扩大整个树权限。

**复盘问题**

- 哪条证据首先把问题缩小到宿主、容器或依赖？
- 一个容器内端口与宿主发布端口分别解决什么连接？

**参考资料**

- [缺失的一课：调试与命令行](https://missing-semester-cn.github.io/)
- [缺失的一课：调试与命令行](https://missing-semester-cn.github.io/)
- [Docker 官方：Compose 网络](https://docs.docker.com/compose/how-tos/networking/)
- [Docker 官方：Compose 启停顺序](https://docs.docker.com/compose/how-tos/startup-order/)

**可选延伸（从已有预算中调配时间）**

- 从末步挪10分钟用inspect格式查询一项网络字段，先确认输出不含秘密。

### w10-t06 · 动态规划入门（150 分钟）

操作：完成爬楼梯与打家劫舍，先写状态定义、转移和初始化，再用 Go 实现。验收：能手算一个例子，覆盖最短输入，并解释为何可以减少空间。

**学习目标：** 从状态含义、转移与初值开始完成两道基础动态规划题，能手算、验证边界并说明滚动变量为什么可以节省空间。

**开始前确认**

- 会写Go函数、切片与表驱动测试，做过递归。
- 算法放在项目练习子目录，避免干扰预约业务代码。

**操作步骤**

1. **定义状态和问题契约 · 25 分钟**

   - 先对爬楼梯写出dp[i]的中文含义，说明一次可走1或2阶，选择n=0的返回约定。
   - 手画n=1到5的答案如何由较小问题得到，不先背公式；注明负数输入处理方式。

2. **实现爬楼梯 · 35 分钟**

   - 先用数组保存状态再编写函数，测试0、1、2、5与非法输入，逐行与手算对照。
   - 说明增长可能超出int范围，不把超大n的溢出结果当正确；在练习契约中限制范围或指出限制。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

3. **实现打家劫舍 · 40 分钟**

   - 规定金额为非负，状态表示前i间房的最大收益；手算包含连续大数和隔一间大数的例子。
   - 说明当前房选择与不选择各依赖哪个已算状态，再处理空数组、单房和两房。
   - 独立编码并自测，不把递归枚举的指数复杂度与动态规划复杂度混为一谈。

4. **改为滚动状态 · 30 分钟**

   - 保留数组版本用于对照，识别转移只需要最近两项，写滚动变量版。
   - 用相同测试比较两版，检查更新顺序没有覆盖仍要读取的旧状态；解释时间O(n)、额外空间O(1)。

5. **口述与错因记录 · 20 分钟**

   - 脱离代码讲清两道题状态、初值、转移和答案位置，每题最多2分钟。
   - 记录一条真实错误和触发输入，若主任务未完成先保留数组版，滚动优化可延期而不挤占休息。

   ```text
   cd ~/projects/lab-booking
   git diff --check
   ```

**完成后逐项验收**

- 两题各有状态与转移的中文说明。
- 爬楼梯覆盖0/1/2，打家劫舍覆盖空/单/双元素。
- 手算至少一个五项例子与输出一致。
- 数组版与滚动版同用例一致，能解释复杂度及溢出限制。

**保留的学习产物**

- 两题练习代码和边界测试。
- 状态手算表与错因记录。

**问题排查**

- 滚动变量版答案偏小：先对照数组版逐步输出旧状态，确认赋值次序没有提前覆盖所需值。
- 边界题直接下标越界：先写空输入与n=0契约，进入循环前处理初值；不要只测试五项正常输入。

**复盘问题**

- 定义dp[i]时下标代表数量还是位置，这会怎样影响初值？
- 什么证据说明滚动版没有改变业务含义？

**参考资料**

- [Go by Example：函数与切片](https://gobyexample-cn.github.io/)
- [Go by Example：函数与切片](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 如提前完成，从口述步骤挪10分钟比较递归重复子问题，仅画调用树，不新增题量。

### w10-t07 · 更新复现文档，跟进投递与到岗条件（120 分钟）

操作：推送容器配置与复现记录，投递 5 个岗位；对进入面试的机会确认城市、每周出勤、实习期限、研究生课程安排及到岗日期。验收：投递表有下一步时间，项目介绍可解释容器网络与持久化。

**学习目标：** 把容器复现证据带入真实项目介绍，继续五个匹配机会的投递/跟进，并准确核对城市、出勤与研究生课程约束。

**开始前确认**

- 本机Compose从配置到预约验证已完成。
- 已有岗位表，实际可到岗日期与每周空闲天数可估算。

**操作步骤**

1. **核对文档和提交范围 · 25 分钟**

   - 检查Dockerfile、Compose、环境样例和README，排除.env、日志、个人数据及构建产物。
   - 记录本机启动、迁移、重启和停止结果，阅读diff后由自己按已配置远程推送；课程只给步骤，本次生成不执行推送。

   ```text
   cd ~/projects/lab-booking
   git status --short
   git diff --check
   ```

2. **筛选并核对五个机会 · 30 分钟**

   - 从公司招聘页面核实技能和城市，补官网链接、查询日期及岗位要求，不依据旧转载推定仍在招。
   - 选择实际可出勤与期限相符的五个投递或跟进，写明研一、宜昌就读与课程时段；不足五个如实记录。

3. **确认到岗条件 · 25 分钟**

   - 对进入面试的机会整理待确认问题：办公室城市、每周至少几天、最少月数、开始日期、课程冲突与是否支持请假。
   - 以现有沟通渠道核实并记录来源与日期；不把未回复条件填成已确认，暂不擅自承诺无法保证的出勤。

4. **练习项目解释 · 25 分钟**

   - 用两分钟解释容器网络：浏览器到回环宿主端口、app到db/redis服务名，不把localhost笼统当所有地方都相同。
   - 再解释镜像、容器层与volume以及删除卷的后果，给一个重启数据保留的真实记录作为证据。
   - 把一次Docker排错讲成现象、证据、修复三句，删掉仅背术语的表达。

5. **更新下一步日程 · 15 分钟**

   - 岗位表记录投递日期、简历版本、状态、下一动作日期和待核实条件。
   - 给下一次模拟面试安排具体日期，未完成文档修改从可选范围调整，不延长本任务总时间。

**完成后逐项验收**

- 复现说明含配置、健康、迁移和预约步骤，秘密未进入提交。
- 岗位表有五个实际投递或跟进及官网依据，不足有原因。
- 面试机会的到岗条件区分已确认与待确认。
- 能用两分钟准确说明网络与持久化。

**保留的学习产物**

- 更新的复现文档和项目提交记录。
- 岗位表、到岗核对清单与讲解提纲。

**问题排查**

- 推送前发现.env被跟踪：停止本次推送，移除跟踪并处理已暴露凭据，确认历史风险；只加.gitignore不会删除已有跟踪。
- 课程安排与公司出勤冲突：先列实际可用时段再核对要求，调整目标机会而非作模糊承诺。

**复盘问题**

- 你能凭哪条记录证明项目在新环境复现过？
- 哪些到岗条件会直接决定这个机会是否可执行？

**参考资料**

- [Docker 官方：Compose 网络](https://docs.docker.com/compose/how-tos/networking/)

**可选延伸（从已有预算中调配时间）**

- 筛选提前结束可从末步挪10分钟回听网络讲解，修正一个地址误用即可。

### w10-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟从新 clone 开始口述完整启动流程并标出易错步骤；30 分钟离屏活动。验收：留下 3 条排错经验、实际时长和下周模拟面试清单。

**学习目标：** 用30分钟回放新clone到预约的复现路径，提炼三条排错经验并筛出模拟面试重点，再用30分钟离屏活动。

**开始前确认**

- Docker启动、迁移、重启和排错记录齐备或明确标注缺失。
- 本周仍按1200分钟预算，复盘不能变成继续部署。

**操作步骤**

1. **复现口述与重点选择 · 30 分钟**

   - 前10分钟不看README口述clone、配置、镜像构建、依赖健康、迁移、应用启动和预约验证；卡住的地方回看文档并标注缺口。
   - 中间10分钟从端口、DNS与权限排错各挑一条有证据的经验，写触发条件、最先检查项和正确恢复动作，不能只写“重启后好了”。
   - 最后10分钟记录每项实际用时，选择下一周三项重点：一类独立故障、一个Go薄弱点和一次模拟面试；延期内容替换同等预算，真密码不进复盘。

2. **离屏活动与恢复 · 30 分钟**

   - 设好30分钟提醒后离开电脑，散步、舒缓伸展或轻松活动，不带学习视频和手机继续查Docker问题。
   - 结束后简单记休息开始结束时间，关注眼睛、肩颈与疲劳状态；不要求在休息时做题或整理面试答案。
   - 把下次学习入口停在一条可执行的小动作，例如查看已写故障清单；若本周超预算，下周先删可选扩展而非压缩休息。

**完成后逐项验收**

- 复现口述覆盖配置、健康检查、迁移和业务验证。
- 三条排错经验各有根因证据与恢复动作。
- 下周模拟面试清单与三个重点写清。
- 本周实际分钟数与30分钟离屏记录可核对。

**保留的学习产物**

- 本周复盘及三条排错经验。
- 第11周重点和模拟面试清单。

**问题排查**

- 把容器能启动误当整个项目已复现：检查登录、权限和预约事务实际流程；健康接口与迁移成功分别留证。
- 复盘发现太多漏洞无法收尾：按正确性、可运行、表达顺序只选三项，下周以等量替换方式处理，保留离屏时间。

**复盘问题**

- 从新环境启动时最容易遗漏哪条隐含依赖？
- 哪个排错步骤能够在没有别人提示时独立完成？

**参考资料**

- [Docker 官方：Compose 启停顺序](https://docs.docker.com/compose/how-tos/startup-order/)

**可选延伸（从已有预算中调配时间）**

- 可从复盘30分钟内挪5分钟完善启动时序图，离屏30分钟保持完整。

## 第 11 周：集中排错与模拟面试

目标：能独立定位常见后端故障，并把 Go、数据库、网络与项目经验讲成具体证据。

### w11-t01 · 模拟三类线上形态故障（180 分钟）

操作：在本机复现数据库慢查询、连接池耗尽与 Redis 停机；为每次记录现象、假设、检查命令、证据和修复。验收：提交 3 份短故障记录，每份能用步骤重新触发并验证恢复。

**学习目标：** 只在隔离学习环境复现慢SQL、连接池等待与Redis停机，按证据缩小根因并验证恢复，形成三份可重放的故障记录。

**开始前确认**

- 本机Compose可启动、数据卷名称清楚。
- 独立学习库有合成数据，请求脚本和超时日志可用。

**操作步骤**

1. **准备基线与保护边界 · 25 分钟**

   - 保存当前提交号、正常请求时延、DB.Stats与服务健康状态，限制请求数量和并发，避免耗尽整机资源。
   - 三次故障分开进行，写现象、假设、检查、证据、修复、恢复验证六格，不连接真实业务库。

   ```text
   cd ~/projects/lab-booking
   git rev-parse HEAD
   docker compose ps
   ```

2. **复现慢查询 · 45 分钟**

   - 在独立测试查询加入可控短延迟或选测试表缺索引查询，让请求超时/耗时明显；限定时长与样本量。
   - 记录EXPLAIN、请求ID及数据库耗时，区分扫描量问题与主动延迟；不把人为SLEEP称为真实索引瓶颈。
   - 恢复原SQL或增加有证据需要的学习索引，使用同样请求重测。

3. **复现连接池等待 · 45 分钟**

   - 仅在测试配置把MaxOpenConns设小，控制一条长查询占连接，再发第二条带超时查询。
   - 观测DB.Stats的InUse、WaitCount和WaitDuration；解释等待连接与执行慢SQL不是同一个阶段。
   - 释放查询、关闭rows/回滚事务再检查池恢复，优先修资源释放而非无限调大连接数。

4. **复现缓存停机 · 40 分钟**

   - 只停止本项目Redis，观察设备列表fallback和数据库查询数；预约仍保持事务冲突校验。
   - 恢复Redis后重复同一请求，比较恢复时延和缓存重建，不删除MySQL卷或共享缓存键。

   ```text
   cd ~/projects/lab-booking
   docker compose stop redis
   docker compose start redis
   ```

5. **总结证据与防复发 · 25 分钟**

   - 把三份记录补上准确的触发/恢复步骤与原始日志路径，另列未验证假设。
   - 从异常请求追到SQL或缓存日志，复核全部临时配置恢复；每份报告用一句话说为何修复能解决根因。

   ```text
   cd ~/projects/lab-booking
   docker compose logs --tail 100 app db redis
   ```

**完成后逐项验收**

- 三类故障分别有可重触发的步骤和恢复验证。
- 连接池记录包含等待指标而非只看HTTP耗时。
- 慢SQL实验明确人为延迟或扫描原因。
- Redis停机时回源与预约事务行为正确。

**保留的学习产物**

- 三份短故障报告及脱敏日志。
- 正常/故障/恢复结果对照表。

**问题排查**

- 池耗尽后盲目增加MaxOpenConns：先检查未关闭rows、未回滚事务和长查询，复现释放后恢复，再评估数据库容量。
- 故障叠加无法判断根因：一次只改一个条件，回到基线确认恢复，再执行下一类；记录每次临时配置。

**复盘问题**

- 哪些证据证明等待发生在连接池而非数据库执行阶段？
- Redis回源正确却大量失败时还应检查什么？

**参考资料**

- [缺失的一课：调试与性能分析](https://missing-semester-cn.github.io/)
- [缺失的一课：调试与性能分析](https://missing-semester-cn.github.io/)
- [Go 官方：管理数据库连接](https://go.dev/doc/database/manage-connections)

**可选延伸（从已有预算中调配时间）**

- 从总结步骤挪10分钟画一条连接占用时序，预算不增加。

### w11-t02 · 用 pprof 观察 Go 服务（180 分钟）

操作：在单独回环调试端口启用 pprof，运行固定请求脚本并观察 CPU 或内存 profile，选择一个有证据的问题处理。验收：保留 profile 与结论，能说明 goroutine 泄漏的排查方向；没有瓶颈也如实记录。

**学习目标：** 在仅回环可达的独立调试端口采集Go CPU或内存profile，用固定负载区分热点、分配与泄漏线索，不凭单次样本宣称优化。

**开始前确认**

- 预约服务可运行，知道Go程序实际入口。
- 固定请求脚本可重跑；profile只含合成学习数据并被Git忽略。

**操作步骤**

1. **隔离调试入口 · 30 分钟**

   - 使用独立ServeMux注册pprof处理函数并绑定127.0.0.1:6060，生产/演示API的Mux不暴露debug路径。
   - 如果运行容器，只在专用学习配置内启调试监听，并仅向宿主127.0.0.1发布；不能为便捷把pprof开放到公网。

   ```text
   cd ~/projects/lab-booking
   ss -lntp
   ```

2. **采集一个可解释样本 · 45 分钟**

   - 选择CPU或heap一种主线，记录提交号、启动配置、数据量和固定30秒负载。
   - CPU采样期间并行运行请求脚本，heap注明是存活内存还是累计分配口径；profile保存到被忽略的练习目录。
   - 先确认调试URL返回有效profile，再用go tool pprof打开；不要把空样本当服务很快。

   ```text
   cd ~/projects/lab-booking
   go tool pprof -top http://127.0.0.1:6060/debug/pprof/profile?seconds=30
   ```

3. **读结果并提出假设 · 40 分钟**

   - 查看top的flat/cum并选一个函数追到调用链，用请求日志检查是否与已知慢点一致。
   - 若怀疑goroutine泄漏，先比较请求开始前、完成后和等待一段时间后的数量与栈，不把goroutine多就直接定性泄漏。
   - 写出一个可验证的假设，例如重复序列化或后台循环未退出，不能凭函数名就改算法。

   ```text
   cd ~/projects/lab-booking
   curl 'http://127.0.0.1:6060/debug/pprof/goroutine?debug=1'
   ```

4. **有限修复与复测 · 40 分钟**

   - 只处理证据明确且能在本预算验证的一处问题，保存修复前后同条件profile。
   - 没有稳定热点就保留无结论结果与采样限制；若改了代码，运行对应正确性测试再比较耗时。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

5. **收尾调试配置 · 25 分钟**

   - 关闭临时pprof开关，确认普通API不能访问debug端点，避免profile与栈日志入Git。
   - 报告写观察、假设、验证、结论和限制，记录下一次采样应如何控制条件。

   ```text
   cd ~/projects/lab-booking
   git status --short
   ```

**完成后逐项验收**

- pprof仅独立回环端口可达，业务API无debug路径。
- profile可读取且包含固定负载条件与提交号。
- 结论能对应top/调用链或goroutine栈证据。
- 修复有同条件复测，未找到问题也如实留证。

**保留的学习产物**

- profile样本与采样步骤说明。
- 一页观测结论及必要修复验证。

**问题排查**

- CPU profile几乎没有样本：检查负载是否与采样窗口重叠，增加有界请求数量；等待IO占比高时CPU低本身也是线索。
- 普通HTTP端口意外出现pprof：检查默认Mux的注册与复用，改独立Mux/配置开关并测试业务端口404。

**复盘问题**

- flat与cum分别提示哪些定位方向？
- goroutine数量增长后怎样排除正常并发尚未结束？

**参考资料**

- [李文周：pprof 性能分析](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：pprof 性能分析](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方：net/http/pprof](https://pkg.go.dev/net/http/pprof)

**可选延伸（从已有预算中调配时间）**

- 主任务提前结束，从报告步骤挪10分钟再采一次heap，不能因工具新鲜扩大调优范围。

### w11-t03 · 整理 Go 高频问题并用代码验证（180 分钟）

操作：复习 slice/map、interface、defer、error、channel、Mutex 与 context，各用一个短例子验证易错点。验收：随机抽 4 个问题，不看资料解释并运行示例，不把背诵答案当作理解。

**学习目标：** 把slice/map、interface、defer、error、channel、Mutex和Context的常见误解转为七个短实验，随机口述四题检验真正理解。

**开始前确认**

- 前10周已有相关代码，Go工具链可直接运行。
- 练习位于独立子目录，每例尽量不超过30行，避免只背完整面试答案。

**操作步骤**

1. **列七张问题卡 · 25 分钟**

   - 每概念选一个具体问题：slice共享底层数组、map缺键、interface有类型nil、defer求值、error包装、channel阻塞、取消/锁。
   - 卡上先写自己的预测输出与理由，再看文档验证；旧文章中的版本相关说法要用当前Go实测。

2. **完成数据与接口实验 · 45 分钟**

   - 用slice修改与append观察容量变化和别名，指出是否扩容需看cap，不能预设每次append都复制。
   - 对map缺键与零值用comma-ok区分，对接口装入nil指针验证与nil接口不同。
   - 保存预测、实际输出和修正解释，错误发生在哪里要具体到语句。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

3. **验证defer与error · 35 分钟**

   - 设计一条defer参数立即求值与函数退出执行的对照例；用命名返回值变化说明观察结果。
   - 用errors.Is/As验证包装后的错误识别，不仅比对错误字符串；把日志上下文和向上返回责任区分。

4. **验证并发与取消 · 45 分钟**

   - 用小channel实验观察阻塞和关闭读取，再给共享计数加Mutex并运行race检测；实验中的死锁设置超时退出。
   - 写一个worker监听Context取消并报告退出，明确关闭channel、取消任务与等待完成各不相同。
   - 对照预约项目指出一段实际使用锁或Context的代码，不把channel当所有共享状态的万能替代。

   ```text
   cd ~/projects/lab-booking
   go test -race ./...
   ```

5. **随机讲四题 · 30 分钟**

   - 打乱七张卡随机取四张，每题先口述90秒再运行例子，记录是否需提示。
   - 把三处错误改成条件明确的答案；列一条尚不确定问题留待复习，不靠延长本任务凑熟练度。

   ```text
   cd ~/projects/lab-booking
   go vet ./...
   ```

**完成后逐项验收**

- 七个概念各有预测、输出和自己的解释。
- slice别名和typed nil误解有可运行证据。
- 并发例在修复后race通过，取消worker能结束。
- 随机四题不看资料说明并运行示例，错误有修正。

**保留的学习产物**

- 七个短实验及测试。
- 问答卡和随机口述记录。

**问题排查**

- interface比较nil得到意外结果：打印动态类型和值，区分(nil,nil)接口与含nil指针的非nil接口。
- worker取消后仍卡在发送：发送处也用select监听ctx.Done，接收结束要配合等待机制，不只在循环开头检查。

**复盘问题**

- 哪个实验推翻了你从C/Python带来的默认想法？
- 为什么race通过仍不能证明不存在业务并发错误？

**参考资料**

- [Go by Example 中文](https://gobyexample-cn.github.io/)
- [Go by Example 中文](https://gobyexample-cn.github.io/)
- [Go官方：Effective Go](https://go.dev/doc/effective_go)

**可选延伸（从已有预算中调配时间）**

- 从随机口述步骤挪10分钟重答最差一张卡，不新增泛型或运行时源码范围。

### w11-t04 · 用项目复习 MySQL 与缓存问题（180 分钟）

操作：围绕预约项目复习索引、EXPLAIN、事务、锁、隔离级别、连接池和缓存失效；对 2 个薄弱点做实验。验收：能用自己的表和查询回答问题，保存实验 SQL 与结果，区分事实和未验证推断。

**学习目标：** 围绕真实预约表复习索引、事务与锁，借两个可重放实验解释数据库正确性和缓存陈旧窗口，区分已测事实与理论推断。

**开始前确认**

- 预约事务与设备缓存已实现，有独立测试库。
- 已有schema、EXPLAIN、连接池和并发预约证据。

**操作步骤**

1. **用项目生成问题清单 · 30 分钟**

   - 列出七个问题：索引选列、EXPLAIN含义、事务边界、锁对象、隔离级别、池等待、缓存失效。
   - 每题链接到一段自己的SQL/代码/测试，先标能解释、需查证和无实验，选择两个最弱点深入。

2. **实验一：查询与索引 · 40 分钟**

   - 在合成设备表用相同过滤条件比较已有索引与计划，保存EXPLAIN字段；查询数据太少时说明优化器可能不用索引。
   - 只在独立表试建/撤一条学习索引，比较读计划与写入维护代价，不改共享库或业务约束。
   - 用自己的查询解释最左前缀和回表，避免用记忆里的绝对规则代替当前计划。

3. **实验二：事务与锁 · 50 分钟**

   - 使用两个数据库会话或并发测试触发同设备同时间预约，记录等待、冲突和提交顺序。
   - 检查实际隔离级别，明确现有方案锁了什么，唯一约束是否只保护固定时段；任意时间区间的重叠不能靠普通唯一键保证。
   - 保留事务内检查与插入、失败回滚和约束测试，不用Redis锁替代MySQL的正确性设计。

4. **关联连接池与缓存 · 35 分钟**

   - 把连接池耗尽记录与事务持有连接时间对应，解释为什么没关闭rows或事务会影响别的请求。
   - 回放更新提交后删缓存与旧读回填的交错，指出TTL只能限制陈旧时间，不能承诺每次读取最新。
   - 需要强实时设备状态时说明绕过缓存/版本控制的选择，以及当前未实现部分。

5. **口述并整理证据 · 25 分钟**

   - 随机讲索引与事务各两分钟，指向表、SQL和结果，明确实验结论适用条件。
   - 把未验证隔离行为标为待测，整理两份实验与问题卡；错误说法不能原样进入简历。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

**完成后逐项验收**

- 七问题各有自己项目证据或明确待验证标记。
- 索引实验保留SQL、EXPLAIN和数据量。
- 事务实验显示同一冲突场景最多一个成功。
- 能区分固定时段唯一约束与任意区间重叠处理。
- 缓存一致性限制和连接池等待解释准确。

**保留的学习产物**

- 两份数据库实验记录及SQL。
- 项目数据库/缓存问答卡。

**问题排查**

- 误认为有事务就不会重复预约：检查隔离下读后写是否竞争，核对锁、约束或固定时段设计，再用并发测试验证。
- EXPLAIN看见索引就说一定更快：记录key、扫描行估计、过滤与实际耗时，数据规模小或选择性差时收益可能不成立。

**复盘问题**

- 你的预约方案在哪个条件下保证正确，在哪个条件下还不够？
- 缓存列表陈旧为什么不能决定预约是否冲突？

**参考资料**

- [李文周：MySQL 与 Redis](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：MySQL 与 Redis](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方：管理数据库连接](https://go.dev/doc/database/manage-connections)

**可选延伸（从已有预算中调配时间）**

- 从整理步骤挪10分钟补锁等待时序图；不扩展成分布式锁作业。

### w11-t05 · 复习 TCP、HTTP、进程与死锁（150 分钟）

操作：画 TCP 建连关闭、HTTP 请求响应和进程线程关系图；用 curl、ss、ps 验证可见部分，复习死锁成立条件。验收：能连续 5 分钟解释一次请求从客户端到数据库，说明哪部分仅是概念图。

**学习目标：** 串起TCP、HTTP、进程/线程与死锁概念，用Linux能观察到的证据讲清一次请求到数据库的流程，并标明理论图与实际观测的边界。

**开始前确认**

- 本机回环HTTP接口可访问，日志包含请求ID。
- 理解API、MySQL与Redis关系，可使用curl、ss、ps。

**操作步骤**

1. **画TCP与HTTP流程 · 30 分钟**

   - 分别画建连、请求响应、关闭流程，标出HTTP消息在TCP字节流之上，不把一个HTTP请求等同一个TCP连接。
   - 说明持久连接可复用，TCP关闭可由任一端发起；不把常见四次挥手示意当所有抓包的唯一形式。

2. **观察实际连接 · 30 分钟**

   - 用curl -v看地址、方法、请求头与响应，日志对照一个请求ID；认证头可能含令牌，保存前必须脱敏。
   - 在请求进行时用ss观察LISTEN/ESTAB，短连接太快看不到时使用受控长请求；这些工具不能直接证明每个握手报文。

   ```text
   cd ~/projects/lab-booking
   curl -v http://127.0.0.1:8081/health
   ss -lntp
   ss -ntp
   ```

3. **关联进程线程与协程 · 30 分钟**

   - 用ps找Go进程和线程，解释线程共享地址空间但各有执行状态；goroutine是Go调度单位，不与系统线程一一对应。
   - 在图中区分客户端进程、应用进程、数据库进程及连接池，描述请求取消怎样传到查询。

   ```text
   cd ~/projects/lab-booking
   ps -eLf
   ```

4. **用等待关系理解死锁 · 35 分钟**

   - 画两把锁反向获取的等待图，写互斥、占有并等待、不可抢占、循环等待四条件。
   - 用学习伪代码或有超时的短实验说明统一锁顺序如何避免一类死锁，不让真实预约服务永久卡住。
   - 区分数据竞争、长等待与死锁；数据库检测死锁并回滚时，应用仍应正确报告和有限重试。

5. **五分钟整段口述 · 25 分钟**

   - 按浏览器、TCP/HTTP、handler、权限、事务、DB连接、响应顺序连续讲5分钟，指向一条日志与查询。
   - 把图上没有实测的DNS、握手报文等标为概念说明，记录两个说不清点并预约复习时间。

**完成后逐项验收**

- 能解释HTTP与TCP层次及连接复用。
- curl、ss、ps各有一份脱敏观测。
- 概念图标明goroutine与线程不是一一对应。
- 死锁四条件和统一锁序措施可用等待图说明。
- 5分钟请求流程讲解包含数据库与错误路径。

**保留的学习产物**

- 请求/连接/进程关系图。
- 观测输出、死锁图与口述记录。

**问题排查**

- ss只显示监听，看不到连接：采样时机可能错过短请求；重复有限请求或控制短延迟，不假定没有连接就无网络通信。
- 把所有慢响应当死锁：先看超时、锁等待、池等待与goroutine栈，必须有循环等待证据才定性死锁。

**复盘问题**

- 哪一部分从工具输出可直接证明，哪一部分只是协议概念？
- Context取消能解除哪种等待，哪些锁仍需明确释放？

**参考资料**

- [缺失的一课：调试与工具](https://missing-semester-cn.github.io/)
- [缺失的一课：调试与工具](https://missing-semester-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 可从口述步骤挪10分钟重画最模糊的一张图，不扩大成抓包工具安装任务。

### w11-t06 · 限时算法与错题回练（150 分钟）

操作：从前 10 周选 3 道错题，分别限时 30 分钟口述、编码和自测；剩余时间分析卡点。验收：每题有正确代码和复杂度，记录是思路、Go 语法还是边界造成失误。

**学习目标：** 从已做错题中完成三轮30分钟限时练习，再用60分钟修复与归因，检验思路、Go编码和边界测试的实际瓶颈。

**开始前确认**

- 前10周保留算法代码和错题记录。
- 选已练过的三题：数组/哈希一题、树/遍历一题、DP或堆一题，避免临时刷全新难题。

**操作步骤**

1. **第一题：数组或哈希 · 30 分钟**

   - 前5分钟口述输入契约、思路与复杂度，中间20分钟独立编码，末5分钟测试空输入、重复与无答案。
   - 到点停止并保存当前状态，不打开旧答案；标完成、部分完成或未完成，以及第一处卡点。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

2. **第二题：树或遍历 · 30 分钟**

   - 仍按5/20/5分配，用手画小树说明访问次序或队列变化；空树与单节点必须自测。
   - 递归需先给终止条件，BFS先给访问标记；记录是思路不清还是Go切片/指针问题导致失误。

3. **第三题：DP或堆 · 30 分钟**

   - 先解释状态/堆不变量再写代码，保留最短输入与k边界约定，不靠记住旧实现跳过解释。
   - 30分钟到点时记录真实结果和剩余问题，正确代码若未完成放在后续修复步骤，不虚报按时通过。

4. **修复并验证三题 · 35 分钟**

   - 回看旧笔记而非先复制答案，优先修本轮最影响结果的边界或状态错误，三个问题各补一个回归用例。
   - 仍未完成的题允许读提示后再关闭提示独立补写，记录提示内容和最终验证；未验证通过明确标未完成。
   - 对每题分别计算时间与额外空间，不把递归栈漏掉，也不把排序成本忽略。

   ```text
   cd ~/projects/lab-booking
   go test ./... -count=1
   ```

5. **归因与安排回练 · 25 分钟**

   - 给每题标思路、语法、边界或时间分配的主因，附触发输入和下一次练习日期。
   - 选一题用2分钟再次口述，下一周先练同类错误，不靠增加大量题目遮盖遗忘。

**完成后逐项验收**

- 三轮各限时30分钟并记录到点实际状态。
- 每题最终有验证结果，未完成如实标注。
- 至少三条触发错误的边界用例保留。
- 每题复杂度和错误分类可解释。

**保留的学习产物**

- 三题重写代码与测试结果。
- 限时记录、错因表和回练日期。

**问题排查**

- 做完代码却没有自测时间：强制保留最后5分钟，优先短边界；下一轮缩短无效改写，不挤占验收步骤。
- 修正后还是不懂为什么错：手算最小失败输入，对照变量变化；记录被破坏的不变量，再补相邻边界验证。

**复盘问题**

- 三题中哪类错误重复出现，改学习方式比增加题量更有效吗？
- 口述能否在编码前暴露状态定义或边界遗漏？

**参考资料**

- [Go by Example：基础语法复查](https://gobyexample-cn.github.io/)
- [Go by Example：基础语法复查](https://gobyexample-cn.github.io/)
- [Go官方：Effective Go](https://go.dev/doc/effective_go)

**可选延伸（从已有预算中调配时间）**

- 若修复提前结束，从最后25分钟内挪10分钟换输入追问，不增加第四题。

### w11-t07 · 完成一次模拟面试并继续投递（120 分钟）

操作：做一次 40 分钟模拟面试并回听，覆盖自我介绍、项目、Go、SQL 和一道题；继续投递或跟进 5 个机会。验收：记录 3 个需修正的回答和下次练习日期，能如实说明 AI 辅助和个人独立完成的部分。

**学习目标：** 完成一次40分钟模拟面试，回听修正三个具体回答，并维持五个匹配机会的投递/跟进；表达独立工作与AI辅助的真实边界。

**开始前确认**

- 项目有可展示代码、测试与故障记录。
- 岗位表和一页简历可用；独自模拟也可，不假装得到真实面试反馈。

**操作步骤**

1. **准备问题与机会 · 15 分钟**

   - 写本次面试提纲并准备录音工具，模拟记录标注日期与角色，不保存别人的私人信息。
   - 快速筛选五个官网可核实机会或已有流程，挑匹配真实出勤与城市条件的项目。

2. **执行40分钟模拟 · 40 分钟**

   - 5分钟自我介绍、10分钟项目、10分钟Go/SQL、15分钟一道旧算法题；用计时器保留真实完成情况。
   - 项目追问包含为什么用Go、事务冲突如何防止、设备缓存能否保证最新、一次排错证据；不懂就说需验证。
   - 算法先口述边界和复杂度再写，明确AI参与了什么、哪些代码由自己理解修改和测试。

3. **回听并修正三答 · 30 分钟**

   - 选择三处最具体的错误，逐条记录原句、问题、修正版、证据及90秒重新回答。
   - 优先改事务、权限和缓存正确性误述，其次语法与项目表达；用代码/SQL/日志核验而非只换说法。
   - 给每条安排下一次复测日期，保留一条追问确认真的理解。

4. **继续投递和跟进 · 25 分钟**

   - 从公司官方页面确认入口，提交或跟进五个机会，记录日期、简历版本和状态；不足五个写原因。
   - 核对到岗日期、每周出勤和期限的待确认项，按本人实际安排填写，不默认实习结果由12周计划保证。

5. **记录下一步 · 10 分钟**

   - 把三个修正回答与下次模拟日期加入清单，挑一项最后一周重点。
   - 投递表每个活跃状态对应一个下一动作日期，保留真实反馈与自测反馈的区别。

**完成后逐项验收**

- 40分钟录制覆盖介绍、项目、Go/SQL和算法。
- 三处错误有原句、修正、验证证据与重答。
- 五个投递/跟进留有官方入口和时间，不足有说明。
- 能准确说明AI辅助和自己独立修改验证部分。

**保留的学习产物**

- 模拟录音/记录与三答修正版。
- 岗位表和下次模拟日期。

**问题排查**

- 回听只评价紧张没有修正内容：截取一条错误句，查代码或SQL，用证据写修正版，再回答同一追问。
- 项目讲解都是“我们做了”：拆成自己决策、独立代码、AI示范、同学建议和验证动作，避免虚构团队职责。

**复盘问题**

- 哪条回答的改进需要补实验，而非调整措辞？
- 面试卡点与公司要求差距是否一致，下一步如何排序？

**可选延伸（从已有预算中调配时间）**

- 若投递提前结束，从末步挪5分钟再答最差一题，不能增加整轮面试时间。

### w11-t08 · 本周复盘与主动休息（60 分钟）

操作：30 分钟把模拟面试反馈压缩成最后一周的 3 个重点；30 分钟离屏活动。验收：删除低价值重复学习，记录实际时长与最后一周交付清单。

**学习目标：** 用30分钟把故障与模拟面试反馈缩成最后一周三个可完成重点，明确交付顺序与删减项，再用30分钟离屏休息。

**开始前确认**

- 本周故障、pprof、问答卡、错题与模拟记录有真实结果。
- 第12周以正确性、复现和表达收尾，不追求临时加新技术。

**操作步骤**

1. **反馈压缩与交付排序 · 30 分钟**

   - 前10分钟回听模拟反馈并核对故障记录，分事实错误、缺证据、表达冗长三类，只保留最影响正确性或演示的三个重点。
   - 中间10分钟列最后一周交付清单：新目录复现、回归证据、版本与演示、简历核验、持续投递；为缺口写下一动作和预算。
   - 最后10分钟合计本周实际分钟数，删低价值重复刷题或新框架扩展；未解决内容注明限制并排后续，延期任务替换等量时间。写出一条明确停止条件，避免为勾选继续熬夜。

2. **离屏休息与恢复 · 30 分钟**

   - 设30分钟提醒，离开屏幕散步或伸展，不在这段听面试录音、查招聘或看pprof报告。
   - 休息结束仅记开始结束与疲劳程度；本周紧张时，下一周先减少可选延伸，保留饮食睡眠与恢复时间。
   - 留下下次打开项目的单一入口，例如按复现清单第一项核对环境；不在结束后补做第四个重点。

**完成后逐项验收**

- 写出三个最后一周重点，均有具体下一动作。
- 交付清单区分必须正确与可延后内容。
- 本周实际用时与删减/替换项记录清楚。
- 完整30分钟离屏有时间记录。

**保留的学习产物**

- 阶段复盘及第12周交付清单。
- 三重点和延期事项记录。

**问题排查**

- 想补全部面试问题导致收尾失焦：先保项目正确性和可复现，再挑最常遇到的两类问题；其余进入后续四周计划。
- 把pprof未发现瓶颈写成已全面优化：改为具体采样条件下未发现稳定热点，保留限制；最后版本说明只列已验证改动。

**复盘问题**

- 最后一周哪项成果能由别人照步骤独立核验？
- 哪些反馈需要立即修复，哪些只是扩大学习范围？

**可选延伸（从已有预算中调配时间）**

- 可从复盘30分钟中挪5分钟精简演示脚本，离屏时间和总预算保持不变。

## 第 12 周：完成交付，形成持续投递节奏

目标：从空环境复现项目，诚实展示能独立完成的工作，并根据反馈安排下一轮学习与求职。

### w12-t01 · 从空目录复现整个项目（180 分钟）

操作：新 clone 预约项目，按 README 创建配置、启动服务、执行迁移和测试，完成用户预约与管理员管理演示；修正所有文档缺口。验收：保留完整命令记录，一位同学能照文档复现，秘密和个人数据未入库。

**学习目标：** 从新的学习目录复现预约项目，验证README是否包含环境、配置、迁移、测试和权限流程，消除依赖原终端状态的隐含条件。

**开始前确认**

- 预约仓库已有自己的可访问远程，Compose配置可运行。
- Docker路线已明确，测试使用合成数据；原环境不删除、不覆盖。

**操作步骤**

1. **建独立复现目录 · 25 分钟**

   - 记录原仓库提交号和远程地址，新目录必须不存在；只克隆自己的学习仓库，不复制原目录里的真实.env。
   - 沿README先检查Go/Docker/Compose版本和context，不因新目录就重复安装；保留原本项目与volume。

   ```text
   cd ~/projects/lab-booking
   git rev-parse HEAD
   git remote get-url origin
   cd ~/projects
   read -r -p '输入自己的仓库URL: ' STUDY_REPO_URL
   git clone "$STUDY_REPO_URL" lab-booking-repro-w12
   ```

2. **准备配置与隔离依赖 · 35 分钟**

   - 在新目录从样例建本地配置，用合成账号；设不同Compose项目名与回环端口，例如18081，使用独立学习volume。
   - 核对容器app监听0.0.0.0:8081和db/redis服务名，按文档启动依赖并等待健康，不复用原项目库来假装空环境。

   ```text
   cd ~/projects/lab-booking-repro-w12
   docker compose config --quiet
   ```

3. **迁移并执行验证 · 50 分钟**

   - 按版本化迁移创建独立库与演示数据，记录真正运行的命令和输出；健康检查不等于表已存在。
   - 运行单元与集成测试，注意集成测试连接的确是新库，保存失败时实际环境而非继续猜。
   - 每个需要临时补查的步骤标成文档缺口，记录依赖变量、工作目录与原因。

   ```text
   cd ~/projects/lab-booking-repro-w12
   go test ./...
   ```

4. **完成角色演示 · 45 分钟**

   - 用虚构学生账号登录、预约、查询、取消，再用管理员完成设备管理；测试普通用户不能做管理或访问他人数据。
   - 执行同时间冲突与Redis不可用回源，确认数据库事务和权限不靠旧环境残留。
   - 请同学按修订文档复现或由自己清理终端变量后重走一次，记录是否用了口头提示。

5. **修正文档并保留边界 · 25 分钟**

   - 将缺口补进原项目README，用新目录复核对应步骤；记录已验证版本与尚未覆盖限制。
   - 核对配置、演示数据与日志没有秘密/个人信息；仅停止新学习项目服务，保留数据卷以便后续验证。

   ```text
   cd ~/projects/lab-booking-repro-w12
   git status --short
   ```

**完成后逐项验收**

- 新目录不依赖原.env、原库或原终端环境。
- 完整记录环境、配置、迁移与测试命令。
- 学生与管理员流程及越权失败均验证。
- 同学或独立重走文档无需关键口头补充，缺口已修。

**保留的学习产物**

- 空目录复现记录与修订README。
- 角色演示结果及独立环境配置说明。

**问题排查**

- 新clone缺少本地未提交文件：回原目录确认必要源码、迁移已跟踪并提交，秘密仍不提交，再按目标提交重做验证。
- Compose项目名相同连到旧卷：在启动前设独立项目名并检查实际volume/数据库，保留两组环境，不能删除旧卷求隔离。

**复盘问题**

- 哪个缺口原先被当前终端或旧数据库掩盖了？
- 别人能复现成功的证据比自己说“能运行”多了什么？

**参考资料**

- [缺失的一课：版本控制与工具](https://missing-semester-cn.github.io/)
- [缺失的一课：版本控制与工具](https://missing-semester-cn.github.io/)
- [Git官方：git clone](https://git-scm.com/docs/git-clone)

**可选延伸（从已有预算中调配时间）**

- 提前结束可从收尾步骤挪10分钟让同学再验证一条失败路径，总时长不增加。

### w12-t02 · 整理测试证据并完成最后回归（180 分钟）

操作：运行单测、竞态检测、数据库集成测试、并发预约和缓存故障验证；只修复阻碍演示或正确性的缺陷。验收：保存环境、命令和结果，记录仍存在的限制，所有新增修复有对应验证。

**学习目标：** 完成最后一轮有记录的正确性回归，只修阻碍演示、权限与预约正确性的缺陷，每次新增修复都附验证而不追求无关重构。

**开始前确认**

- 新目录复现已完成，独立测试库与Redis键前缀明确。
- 现有单测、集成、并发与缓存测试能选择运行。

**操作步骤**

1. **冻结环境与检查矩阵 · 25 分钟**

   - 记录Go版本、提交号、数据库/Redis版本、数据集与配置，列单元、race、集成、冲突预约和缓存故障五类。
   - 把身份权限和取消边界加入人工验证列；检查测试连接指向专用库，不用自己真实资料。

   ```text
   cd ~/projects/lab-booking
   go version
   git rev-parse HEAD
   ```

2. **运行工具与分层测试 · 40 分钟**

   - 执行单测、race和vet并保存退出状态；失败先缩小到具体包/用例，不反复无差别全跑。
   - 独立库执行迁移后运行数据库集成测试，核验SQL事务失败与资源释放，记录项目实际使用的集成测试入口。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   go test -race ./...
   go vet ./...
   ```

3. **验证业务与故障 · 45 分钟**

   - 同设备同时间并发预约核对最多一个成功，同时验证不同设备或不冲突时段可成功。
   - 检查普通用户越权、重复取消、截止时间边界和请求取消，数据库状态必须与响应一致。
   - 验证缓存命中、到期、提交后失效、坏数据与Redis不可达；记录并发旧值回填限制，不能拿缓存代替预约判断。

4. **修阻断缺陷并回归 · 45 分钟**

   - 按正确性、可运行、展示顺序选必须修的问题，为每个写最小复现与先失败的测试。
   - 做小范围修复后先跑相关用例，再跑受影响回归；把不影响交付的重构、框架更换和新功能移出本周。
   - 若无法解决核心缺陷，将对应能力标未完成并停止相关展示，不用删测试或掩盖错误完成勾选。

5. **形成测试证据包 · 25 分钟**

   - 保存命令、日期、环境、样本量、结果与限制；截图只作补充，文本输出应可核对。
   - 确认每个最后修复都指向验证，列仍需人工检查项和已知问题，最后一次构建使用测试通过的同一提交。

   ```text
   cd ~/projects/lab-booking
   git diff --check
   ```

**完成后逐项验收**

- 五类检查各有真实执行结果与环境。
- 冲突最多一成功，正常独立预约也成功。
- 越权失败、事务回滚和缓存回源证据齐全。
- 每个收尾修复有对应测试或可重跑验证。
- 已知限制未被隐藏或写为已完成能力。

**保留的学习产物**

- 最终测试证据包与检查矩阵。
- 缺陷修复记录及已知限制表。

**问题排查**

- race通过就说并发预约正确：race检测内存访问竞争，业务重复预约仍需数据库并发测试与最终行数检查。
- 测试过后又改配置或代码：核对最终提交与配置，重跑受影响检查；演示不能用未经验证的后续版本。

**复盘问题**

- 哪类行为工具测试覆盖不到，必须人工验证？
- 最后修复为何属于阻断项，验证怎样证明已解决？

**参考资料**

- [李文周：测试与并发](https://liwenzhou.com/posts/go/golang-menu/)
- [李文周：测试与并发](https://liwenzhou.com/posts/go/golang-menu/)
- [Go 官方：竞态检测](https://go.dev/doc/articles/race_detector)

**可选延伸（从已有预算中调配时间）**

- 如提前完成，从证据整理挪10分钟复跑一条最关键故障路径，不扩大压测规模。

### w12-t03 · 整理项目说明、演示与版本标签（180 分钟）

操作：整理架构图、表结构、接口、权限、事务与缓存设计，录制 5 分钟演示，提交后打 v1.0.0 学习版本标签。验收：GitHub 首页能找到启动说明、演示和测试，不使用“生产级”或虚构用户量描述练习项目。

**学习目标：** 把学习版本的架构、接口、权限、事务、缓存与演示整理成可审阅交付，给测试通过的提交标记v1.0.0学习里程碑。

**开始前确认**

- 最终回归已留证，工作区改动范围可解释。
- 远程是自己的学习仓库，知道录屏不应展示令牌密码。

**操作步骤**

1. **整理项目入口与架构 · 30 分钟**

   - README首页放环境、启动、迁移、测试和演示入口，架构图标明handler/service/store及MySQL/Redis。
   - 表结构、接口表、权限矩阵分别给出处，写当前固定/可变时段方案及缓存最终一致性限制，不使用生产级标签。

2. **编写五分钟演示脚本 · 35 分钟**

   - 前1分钟介绍场景与范围，2分钟走学生/管理员流程，1分钟展示冲突/越权失败，1分钟给测试与一次排错证据。
   - 只用虚构设备与账号，隐藏终端历史、密码、令牌和个人信息；画面与当前提交实际功能一致。

3. **录制并独立检查 · 45 分钟**

   - 录一段5分钟演示，回看是否能辨认请求、状态与最终预约行，关键点不靠快速切屏。
   - 纠正讲解中把事务当万能锁、缓存当强一致或本机压测当真实用户的句子；保留尚未实现部分。
   - 演示文件按自己的仓库限制选择放置方式，README给可访问入口，不把超大文件盲目加入Git。

4. **提交与创建学习标签 · 45 分钟**

   - 看status/diff核对没有秘密、个人数据、临时profile或二进制，提交文档与确认必要源文件。
   - 先检查v1.0.0是否已存在，只有不存在且目标提交通过回归才创建annotated tag；已有标签不强制移动。
   - 由自己核对远程后推送该提交与明确标签，课程命令供执行，本次计划生成不替你推送。

   ```text
   cd ~/projects/lab-booking
   git status --short
   git diff --check
   git tag --list v1.0.0
   git tag -a v1.0.0 -m 'Study milestone: verified demo and tests'
   ```

5. **验证展示与版本关系 · 25 分钟**

   - 在仓库页面确认启动、演示和测试入口可找到，核对标签所指提交号与证据包一致。
   - 版本说明只列已验证功能、数据与场景范围，记录剩余限制；不写虚构用户量或线上运行经验。

   ```text
   cd ~/projects/lab-booking
   git show --stat v1.0.0
   ```

**完成后逐项验收**

- 首页能找到启动、演示、测试及限制。
- 架构和表/接口/权限说明对应当前代码。
- 5分钟演示包含成功、失败路径及证据。
- v1.0.0是测试通过提交的学习标签，没有覆盖旧标签。
- 项目介绍不含生产级或虚构规模表述。

**保留的学习产物**

- 完整README、架构/权限文档。
- 5分钟演示及v1.0.0学习版本说明。

**问题排查**

- 标签指错提交或已存在：先核对git show和测试提交号，不用-f覆盖；保留原标签并决定新的明确学习版本名。
- 录屏泄露.env或Authorization：删除公开前录制中的泄密部分并按凭据暴露范围处理，重新录合成数据版，检查终端内容。

**复盘问题**

- 版本标签、代码、演示和测试如何证明属于同一成果？
- 哪些限制最需要在别人尝试运行前看到？

**参考资料**

- [缺失的一课：版本控制](https://missing-semester-cn.github.io/)
- [缺失的一课：版本控制](https://missing-semester-cn.github.io/)
- [Git 官方：版本标签](https://git-scm.com/docs/git-tag)

**可选延伸（从已有预算中调配时间）**

- 从末步挪10分钟请同学从首页找启动入口，修导航即可，不增加新页面范围。

### w12-t04 · 打磨简历和项目面试表达（180 分钟）

操作：把简历压到一页，逐条核验功能与指标；练习 2 分钟、5 分钟两个项目介绍，并回答事务、权限、缓存和排错追问。验收：每条项目描述都有代码或实验支撑，能明确说明 AI 生成示范与自己理解、修改、验证的部分。

**学习目标：** 用代码和实验逐条核验一页简历，再练2分钟/5分钟项目介绍与事务、权限、缓存、排错追问，准确展示个人独立贡献和AI辅助。

**开始前确认**

- 项目演示、标签与最终证据包已准备。
- 实际学历、所在城市、可到岗日和每周天数能真实填写。

**操作步骤**

1. **逐条核对简历事实 · 30 分钟**

   - 标出功能、职责、技术和指标四类句子，每句对应代码、测试或测量记录；无法对应就删掉或改成学习目标。
   - 缓存数值写条件和样本，不编业务用户量；项目称课程外学习项目，学历与研一状态、宜昌所在地如实写。

2. **压缩为一页 · 40 分钟**

   - 保留教育、技能、两项目与可到岗条件，使用简洁行为描述：解决什么问题、独立改了哪里、怎样验证。
   - 技能分会独立用与了解，避免把看过pprof写成精通调优；联系方式使用自己的实际资料但不进公开项目仓库。
   - 检查字体、日期、链接和断行，导出后看一遍，确保关键项目和到岗信息易找到。

3. **练两分钟与五分钟版 · 45 分钟**

   - 2分钟版讲场景、最小功能、两项关键决策与验证；5分钟版加数据模型、事务冲突、权限边界和缓存失效。
   - 分别录音，用时间戳标冗长段与未经验证的绝对说法，改为具体条件和证据。
   - 说明AI用于示范/解释的范围，挑一段自己能独立重写、改错和测试的代码展示理解。

4. **回答四类追问 · 40 分钟**

   - 事务题回答冲突场景、隔离/锁/约束与并发测试；权限题回答身份来源、角色和对象归属检查。
   - 缓存题解释回源、TTL与旧值回填边界；排错题用现象、检查、证据和修复讲一次自己的故障。
   - 每类用两分钟回答再核对项目记录，错误句写原回答和修正版，不把模板口号当经历。

5. **核验可用版本 · 25 分钟**

   - 生成一个清晰命名的简历版本并记录使用日期，点开项目链接和演示入口。
   - 把最弱一条追问列下次复习，未完成能力仍说明限制；不以计划结束承诺获得实习。

**完成后逐项验收**

- 简历控制一页且每个项目句子可追到证据。
- 指标含实测条件，未测结果不出现。
- 2分钟与5分钟讲解分别录制并回听。
- 四类追问各有自己的修正和证据。
- AI辅助与个人独立修改验证边界说清。

**保留的学习产物**

- 核验后的一页简历与证据对照表。
- 两个项目介绍录音及追问修正卡。

**问题排查**

- 为显得强把了解写成精通：按是否能独立实现和排错重分能力，删无证据形容词，以具体例子替代。
- 事务回答只说“加锁”：明确锁的数据库对象、获取时机、约束和失败回滚，再指并发测试；不能用Redis锁替代MySQL正确性。

**复盘问题**

- 哪条项目描述在追问后仍有证据支持，哪条需要删减？
- 你能独立讲解修改后的代码，还是仍依赖AI答案？

**可选延伸（从已有预算中调配时间）**

- 主任务提前完成，从版本核验挪10分钟重答最弱追问，保留180分钟上限。

### w12-t05 · 完成 Linux 与网络综合排错练习（150 分钟）

操作：请同学或按自写脚本随机制造端口占用、错误环境变量、数据库不可达、文件权限错误中的两项；仅看现象独立排查。验收：用 curl、ss、ps、日志和权限检查定位，记录处理时间和依据，不靠盲目重启。

**学习目标：** 在只知道故障现象的条件下独立排查两项Linux/网络故障，用请求、端口、进程、日志和权限证据定位并恢复，记录真实耗时。

**开始前确认**

- 项目正常基线可运行，前11周排错表可作事后对照。
- 故障只针对自己的隔离练习项目；同学制造时不要透露根因。

**操作步骤**

1. **准备随机任务与基线 · 25 分钟**

   - 从端口占用、错误环境变量、数据库不可达、目录不可写四项写独立故障卡，随机抽两项。
   - 先记录正常/health、业务响应与配置版本，故障卡说明恢复方法但折起保存；自己准备的脚本只改临时override，不删数据。

   ```text
   cd ~/projects/lab-booking
   curl -i http://127.0.0.1:8081/health
   ```

2. **盲查第一项故障 · 35 分钟**

   - 从现象提出最多三个假设，按客户端→应用→依赖顺序检查，计时并写每条命令排除了什么。
   - 需要看环境变量时只检查变量是否设置或非敏感地址，不把全printenv、完整inspect或密码贴进报告。
   - 定位后提出最小修复，只有确认归属才停止自己的进程，保留修前错误和修后结果。

   ```text
   cd ~/projects/lab-booking
   ss -lntp
   ps -ef
   ```

3. **盲查第二项故障 · 35 分钟**

   - 重新回正常基线再制造第二项；检查日志、监听与连接，区分DNS、连接拒绝、超时和权限错误。
   - 若是文件权限，对实际路径运行ls -ld并核对服务身份；若是数据库，核对服务名、端口和健康，不先盲重启。
   - 在预算内未定位则写已排除项与下一步，用故障卡揭示根因后补理解，真实标记需提示。

   ```text
   cd ~/projects/lab-booking
   docker compose ps
   docker compose logs --tail 80 app db
   ```

4. **恢复与业务验证 · 30 分钟**

   - 恢复临时配置和自己的测试进程，依次验证健康、登录与预约，确认没有隐藏残留。
   - 检查数据行与权限，不能靠chmod 777、公开远程端口、删卷或重建整个库来绕过问题。

   ```text
   cd ~/projects/lab-booking
   git diff --check
   ```

5. **比较独立定位能力 · 25 分钟**

   - 揭示故障卡，对照根因与自己的证据链，记录各项定位/恢复分钟数、是否需提示、漏掉哪一检查。
   - 每项形成一页以内报告与一条防复发措施，不虚报限时独立成功；选择最薄弱项进入后续计划。

**完成后逐项验收**

- 随机两类故障分别有起止时间和检查记录。
- 证据能解释失败发生于客户端、应用或依赖哪层。
- 最小修复后健康及预约恢复，配置回到基线。
- 报告标明提示使用与未解决项，没有破坏性绕过。

**保留的学习产物**

- 两份综合排错记录。
- 恢复验证与个人排错清单。

**问题排查**

- 看见500就直接重启所有容器：先取请求ID和相关日志，检查连接或权限原因；重启可能清掉证据且未修根因。
- 同学随机故障影响原项目数据：提前限定独立项目名和临时配置范围，保存恢复清单；禁止改原库、删除volume或杀未知进程。

**复盘问题**

- 哪个判断基于明确证据，哪个仍只是猜测？
- 下一次遇到同样现象最先执行的两项检查是什么？

**参考资料**

- [缺失的一课：调试与命令行](https://missing-semester-cn.github.io/)
- [缺失的一课：调试与命令行](https://missing-semester-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 若提前定位，从末步挪10分钟重走最慢一项，不增加第三种故障。

### w12-t06 · 算法阶段验收与复习计划（150 分钟）

操作：随机选择数组/哈希、树、动态规划各一道已有题，限时重写；把失误按知识点归类并安排之后每周 3 题。验收：正确解释复杂度和边界，错题有具体复习日期，记录实际完成情况。

**学习目标：** 用三道已有题检验数组/哈希、树与DP的实际掌握，再把遗忘点变为未来四周每周三题的具体复习安排。

**开始前确认**

- 已有题集和第11周错因表，Go测试可运行。
- 题目从做过的范围随机选，不用临时难题衡量初学成果。

**操作步骤**

1. **数组/哈希限时重写 · 30 分钟**

   - 随机选一道旧题，5分钟口述契约和思路、20分钟编码、5分钟自测；不查看旧代码。
   - 记录重复元素、空输入、无答案等实际边界，时间到就记真实完成状态，不能延长单题计时。

   ```text
   cd ~/projects/lab-booking
   go test ./...
   ```

2. **树题限时重写 · 30 分钟**

   - 选遍历、最大深度或BFS旧题，先画小树和访问次序，再按同样5/20/5分配执行。
   - 检查空树、单节点和非平衡结构，复杂度包含递归栈或队列；忘记Go结构体语法单独标记。

3. **动态规划限时重写 · 30 分钟**

   - 从爬楼梯或打家劫舍中抽一题，先说dp状态、初值和转移，再编码与手算对照。
   - 明确最短输入和int范围限制，数组版正确即可，不为了展示技巧跳过正确性直接写滚动版。

4. **修正并核验阶段结果 · 35 分钟**

   - 查看自己的错题记录后修正，三题分别保留触发输入、错误类别、修正版与最终测试结果。
   - 复杂度逐题解释，尚未完成的题写需提示或待复练，不能把阶段验收等同保证面试现场通过。
   - 把相同错误合并成知识点，如map查询、访问标记或状态下标，避免重复记录空泛“粗心”。

   ```text
   cd ~/projects/lab-booking
   go test ./... -count=1
   ```

5. **安排四周回练 · 25 分钟**

   - 未来四周每周安排三题：一题旧错、一题同类迁移、一题混合复习，每题有具体日期与30分钟预算。
   - 复习日程先用现有20小时内的算法份额，不无限叠加课程、项目和投递；每周检查实际完成再换下一周题目。

**完成后逐项验收**

- 三类题各限时30分钟并记录实际完成。
- 每题有边界与复杂度说明和最终验证。
- 错因按具体知识点分类，需提示情况如实标明。
- 未来四周每周三题有日期与时间预算。

**保留的学习产物**

- 三题阶段代码和测试结果。
- 错因分类表与四周回练日程。

**问题排查**

- 只重做记住答案的题感觉全会：随机换输入或让自己先讲状态，检查能否解释而不只复现代码形状。
- 复习表列很多题却没具体日期：以每周三次30分钟写进实际日程，未完成先替换下一次而非不断累积。

**复盘问题**

- 从第1周到现在，哪类题已能独立解释和排错？
- 最频繁错误来自算法模型、Go语法还是验收习惯？

**参考资料**

- [Go by Example：Go 语法复查](https://gobyexample-cn.github.io/)
- [Go by Example：Go 语法复查](https://gobyexample-cn.github.io/)

**可选延伸（从已有预算中调配时间）**

- 有余量从计划步骤挪10分钟给一题换数据口述，仍只保留三道主验收题。

### w12-t07 · 投递与下一阶段行动表（120 分钟）

操作：投递或跟进 5 个匹配岗位，汇总 8 周投递反馈；安排未来 4 周每周岗位筛选、面试复盘和项目维护时间，确认北上广深杭到岗条件。验收：投递表状态清晰，下阶段有日程；未拿到面试时根据岗位差距调整简历和技能重点。

**学习目标：** 完成五个匹配岗位的投递/跟进，基于近八周真实反馈制定未来四周岗位、面试与项目维护日程，持续调整而不承诺实习结果。

**开始前确认**

- 投递表已有近八周记录，最新一页简历与演示可访问。
- 实际到岗日期、课程安排、城市选择与每周出勤可核对。

**操作步骤**

1. **清理近八周反馈 · 25 分钟**

   - 将岗位表按已投、待笔试/面试、需跟进、已结束分组，补查询日期、入口、简历版本、反馈和下一步。
   - 统计实际投递与面试数量，区分没有回复、技能不符和出勤不符；样本少时只作线索，不伪造转化率结论。

2. **选择五个实际动作 · 30 分钟**

   - 查北上广深杭公司官方招聘页面，对照Go/MySQL/网络与可出勤条件筛选，记录具体匹配点和差距。
   - 执行五个新投或合理跟进，不重复催促未到约定反馈日的流程；官网没有适合岗位则如实减少数量并记原因。
   - 填写真实研一/宜昌、可到岗日、每周天数和期限，未确认城市办公安排列待询问。

3. **按反馈选调整方向 · 25 分钟**

   - 未拿到面试时抽三条目标岗位要求对照简历：项目证据是否突出、技能是否缺失、到岗是否冲突。
   - 已进入面试则从真实错误选两项练习，优先项目讲解与数据库正确性，不因为焦虑临时增加多个框架。

4. **制定未来四周日程 · 25 分钟**

   - 每周固定岗位筛选/投递2小时、面试复盘2小时、项目维护2小时、算法1.5小时，剩余时间按课业和薄弱点安排，总预算不超过20小时。
   - 给四周各填具体日期、动作和可验收产物；发生课程或到岗变化时重新分配，不承诺无法稳定的出勤。
   - 项目维护以缺陷和文档为主，学习新技术先写对应岗位证据与时间成本。

5. **确定检查与终止条件 · 15 分钟**

   - 每个活跃机会有下一动作日期；四周后比较真实反馈再改方向，结束的岗位明确归档原因。
   - 没有实习结果时继续小范围试验简历与匹配，而非认为计划失败；12周完成只是阶段交付，不保证录用。

**完成后逐项验收**

- 五个实际投递/跟进有官网依据和日期，不足有真实原因。
- 八周反馈状态清楚，待确认条件独立标注。
- 未来四周含岗位、面试、维护与算法具体时间。
- 调整方向引用岗位差距或反馈证据。
- 持续计划不超过既定学习预算且不承诺录用。

**保留的学习产物**

- 更新的投递表与反馈汇总。
- 未来四周行动表和调整依据。

**问题排查**

- 没有回复就疯狂加投忽略匹配：先核对三条目标要求、到岗与简历证据，小批次调整再观察，保存版本以比较。
- 把课程与实习时间都写满：以真实课表和能坚持的出勤为基础，与机会要求核对，给通勤和休息留实际空间。

**复盘问题**

- 哪些差距能在四周补齐，哪些要求需要换目标？
- 你需要怎样的反馈才会改变下一轮投递策略？

**可选延伸（从已有预算中调配时间）**

- 筛选提前结束，从最后步骤挪10分钟检查一个简历链接，保持120分钟上限。

### w12-t08 · 12 周总结与主动休息（60 分钟）

操作：30 分钟回顾总投入、完成任务、独立改动与仍需帮助的内容，给下一阶段选 3 个目标；30 分钟离屏休息。验收：留下可验证的成长记录，剩余任务按优先级重新安排，不把计划结束等同于掌握全部内容。

**学习目标：** 用30分钟回顾十二周真实投入、独立改动和剩余限制，选下一阶段三个目标，再安排30分钟离屏休息，以可验证成长结束阶段。

**开始前确认**

- 任务完成状态、提交、测试、演示与投递表可回查。
- 计划结束不代表掌握所有Go/Linux知识，也不等同获得实习。

**操作步骤**

1. **十二周证据总结 · 30 分钟**

   - 前10分钟合计十二周实际学习分钟与完成/部分/未完成任务，写出从通讯录到预约项目的关键产物，数据缺失明确标未记录，不补虚构时长。
   - 中间10分钟挑三项能独立完成的工作，每项附提交、测试或排错证据；同时列仍依赖资料/AI/别人帮助的内容，解释自己修改和验证的边界。
   - 最后10分钟把剩余任务按正确性、求职匹配、可选探索排序，给下一阶段选三个目标与第一动作。沿用四周日程，延期替换同等预算，不把学习版本叫生产交付。

2. **主动离屏休息 · 30 分钟**

   - 设30分钟提醒后离开电脑，散步、伸展或做轻松活动；这段不看课程、不整理投递表、不回听面试，让身体和注意力恢复。
   - 结束后仅记休息起止与疲劳感受，避免阶段结束立即用新的大目标占满时间；根据实际课业保持可持续节奏。
   - 下次学习从三个目标中的一个最小动作开始；若尚有核心缺陷，就诚实标记未完成并保留恢复入口，不靠最后熬夜填满清单。

**完成后逐项验收**

- 总结含实际总投入和完成/未完成状态。
- 三项独立能力各有可回查证据。
- 依赖帮助与已知限制如实说明。
- 下一阶段三个目标及第一动作明确。
- 完整30分钟离屏有记录，不承诺阶段结束已全面掌握。

**保留的学习产物**

- 十二周成长记录与证据索引。
- 下一阶段目标和延期优先级表。

**问题排查**

- 总结只列技术名词无法验证：为每项写一条独立完成动作和代码/测试链接，例如定位池等待或修复越权，而非只写学过。
- 看到未完成项就否定全部进步：将已验证能力与待学内容分开，按优先级重新安排；不把课程结束或是否录用作为唯一成果尺度。

**复盘问题**

- 十二周最能证明独立能力的一个改动是什么，证据在哪里？
- 下一阶段怎样在研一课程、项目维护与求职之间维持真实预算？

**可选延伸（从已有预算中调配时间）**

- 可从复盘30分钟挪5分钟给自己写三句下一阶段提醒，离屏30分钟不变。
