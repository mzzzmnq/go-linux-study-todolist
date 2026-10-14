# 本机环境与学习目录

核实日期：2026-10-14。本文覆盖归档材料中的旧机器路径；按现有环境使用，不需要更改 Linux 用户名或搬动学习数据。

## 当前环境

- WSL 发行版名：`Ubuntu`；系统：Ubuntu 22.04.4 LTS；Linux 用户：`mzzzmnq`。
- WSL 物理存储：`D:\WSL\Ubuntu`。这是发行版存储位置，日常编辑源码使用下面的 Linux 路径。
- 学习看板源码：`~/projects/go-linux-study-todolist`，绝对路径为 `/home/mzzzmnq/projects/go-linux-study-todolist`。
- Go 1.27.2：`/usr/local/go/bin/go`；Git 2.34.1；gopls 0.23.0 和 Delve 1.27.2 位于 `~/go/bin`。
- Windows VS Code：`D:\Microsoft VS Code`。官方 WSL 和中文插件安装在 Windows，Go 插件安装在 WSL 环境。

## 进入 Ubuntu 并启动看板

在 Windows PowerShell 中执行：

```powershell
wsl -d Ubuntu
```

进入 Ubuntu 后，用 `whoami` 确认用户，用 `pwd` 查看当前目录，再进入项目：

```bash
whoami
cd ~/projects/go-linux-study-todolist
pwd
go version
git --version
go run .
```

浏览器打开 `http://127.0.0.1:8787`。保持运行服务的终端打开；在自己终端前台运行的服务可按 `Ctrl+C` 停止。若页面已可访问或端口已有服务，先确认现有服务，不要重复启动。

也可以在 Windows 双击 `D:\Projects\Start-Go-Linux-Study.cmd` 启动，或双击 `D:\Projects\Open-Go-Linux-VSCode.cmd` 用 VS Code 打开 WSL 项目。编辑前确认 VS Code 左下角显示 WSL 环境。

如果另行克隆到 Windows 文件夹，项目内的 `start-windows.cmd` 用于原生 Windows Go 启动，会使用那份仓库内的 `data/`。日常学习使用上述 WSL 入口，以免把两份进度混淆。

## 练习项目分别建立

学习看板与课程中自己编写的练习是不同项目。`contacts` 和后续的 `lab-booking` 按课程分别创建，放在 `~/projects` 下，与看板目录并列。

第一周只需先建立通讯录练习目录和模块，再按课程自己编写程序：

```bash
mkdir -p ~/projects/contacts
cd ~/projects/contacts
go mod init contacts
```

跨机器时统一使用 `~/projects` 的目录约定。`~` 表示当前 Linux 用户的家目录，无需为了匹配示例修改用户名；本机绝对路径用于定位和排错。

## 学习数据与同步

在看板源码目录启动时，进度保存到 `/home/mzzzmnq/projects/go-linux-study-todolist/data/state.json`。默认 `data` 相对启动工作目录，因此换目录启动可能生成另一份数据；以服务日志中的保存路径为准。不要在服务运行时直接编辑此文件。

Git 同步源码，不包含个人进度。跨机器迁移时，在页面导出 JSON，传输备份后在目标机器导入；导入会替换目标机器的当前记录，导入前先导出一份备份。路径说明更新不会自动同步或搬迁数据。

## 单份源码与工位电脑

本机只保留 `~/projects/go-linux-study-todolist` 这一份 TodoList 源码。`D:\Projects` 中的两个 `.cmd` 文件是启动入口；Windows 文件资源管理器通过 `\\wsl.localhost\Ubuntu\home\mzzzmnq\projects\go-linux-study-todolist` 访问的也是同一份 Linux 文件。生成课程时使用的 `.go-linux-plan-update`、`.go-linux-plan-preview`、`.go-linux-doc-update` 是临时目录，不作为开发入口。

工位电脑首次使用时，在那台电脑的 Ubuntu 终端执行一次：

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/mzzzmnq/go-linux-study-todolist.git
cd go-linux-study-todolist
code .
```

以后每次开始工作，先保存本机尚未提交的改动，再在项目目录拉取：

```bash
cd ~/projects/go-linux-study-todolist
git status --short
git pull --ff-only
```

结束工作前，在 VS Code 的源代码管理中检查、暂存并提交这次改动，然后执行 `git push origin main`。提交只保存在当前电脑；推送后另一台电脑才能拉取。若快进拉取失败，先检查两端提交并处理差异，不使用强制推送覆盖另一端的工作。

两台电脑的 Linux 用户名和 Windows 盘符可以不同，Ubuntu 内继续使用 `~/projects/...`。Go、WSL、数据库、插件和 `.env` 分别在各自机器配置；`contacts` 与 `lab-booking` 各自建立独立 Git 仓库。
