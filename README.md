# vuecmf
VueCMF内容管理快速开发框架v3

# 项目介绍
VueCMF是一款完全开源免费的内容管理快速开发框架。采用前后端分离模式搭建，v3版本前端使用vue3、Element Plus和TypeScript构建，后端API的PHP版基于ThinkPHP8开发，Go版基于Gin开发。可用于快速开发CMS、CRM、WMS、OMS、ERP等管理系统，开发简单、高效易用，极大减少系统的开发周期和研发成本！甚至不用写一行代码就能设计出功能强大的管理系统。

# 示例演示
- [vuecmf示例演示](http://www.vuecmf.com/)

## 注意
当前仓库为v2.0版本前端，现已停止更新，请使用最新版vuecmf-web，详情见下面介绍

## 前端：
github https://github.com/vuecmf/vuecmf-web

gitee https://gitee.com/emei/vuecmf-web


## 后端：

#### PHP版:
github https://github.com/vuecmf/vuecmf-php

gitee https://gitee.com/emei/vuecmf-php

#### Go版:
github https://github.com/vuecmf/vuecmf-go

gitee https://gitee.com/emei/vuecmf-go


# 前端
## 安装运行环境
第一步：安装nodejs (已安装过的则跳过此步骤)，建议安装v20+

- [下载nodejs（https://nodejs.org/zh-cn/）](https://nodejs.org/zh-cn/), 并安装完后，在命令行执行下面操作安装yarn
```
npm install -g yarn

npm install -g degit
```

第二步：使用vuecmf-web模板创建项目

```
npx degit vuecmf/vuecmf-web my-project
```
my-project为你创建的项目名称，可自定义

若因网络问题无法创建模板，也可直接打开 https://gitee.com/emei/vuecmf-web 下载

第三步：下载依赖包
```
cd my-project
yarn install
```

## 运行项目
```
# 如果是开发调试，则在命令行输入下面回车
yarn dev

# 如果是发布到测试环境运行，则在命令行输入下面回车
yarn build:test

# 如果是发布生产环境运行，则在命令行输入下面回车
yarn build-only

```

## Docker部署
若没有安装docker，则必须先安装docker，然后在项目根目录下执行如下命令即可快速部署项目
```
docker compose up -d
```

# 后端（PHP版）
## 安装

创建新项目

~~~
composer create-project vuecmf/vuecmf myproject
~~~

若在已有基于thinkphp8的项目中安装, 则需执行下面
~~~
composer require vuecmf/framework

php think vuecmf:publish
~~~

## 初始化数据

修改.env文件中数据库连接配置（已设置则跳过）

然后执行迁移工具

```
php think migrate:run
```

## 更新框架
~~~
composer update vuecmf/framework
~~~

## 注意
服务器必须配置伪静态，前端才可正常请求后端接口
配置示例见[使用手册](http://www.vuecmf.com/guide/#php%E8%AF%AD%E8%A8%80%E7%89%88%E6%9C%AC-1/)


# 后端（Go版）
注意：**以下操作均在命令行中执行**

## 安装govuecmf命令行工具
~~~
go install github.com/vuecmf/govuecmf@latest
~~~

## 安装

创建新项目

~~~
mkdir myproject
cd myproject
govuecmf init myproject
~~~


## 初始化数据

修改config/database.yaml文件中数据库连接配置

然后执行如下操作，进行数据初始化

```
govuecmf migrate init
```
更多命令操作，可执行如下，查看帮助
```
govuecmf -h
```

## 调试与编译
调试
~~~
go run .
~~~
编译
~~~
go build
~~~

## 启动项目
直接执行已编译好的可执行文件即可
~~~
./myproject
~~~
