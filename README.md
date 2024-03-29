# vuecmf
VueCMF内容管理快速开发框架v2

# 项目介绍
VueCMF是一款完全开源免费的内容管理快速开发框架。采用前后端分离模式搭建，2.1+版本前端使用vue3、Element Plus和TypeScript构建，后端API的PHP版基于ThinkPHP6开发，Go版基于Gin开发。可用于快速开发CMS、CRM、WMS、OMS、ERP等管理系统，开发简单、高效易用，极大减少系统的开发周期和研发成本！甚至不用写一行代码就能设计出功能强大的管理系统。

# 示例演示
- [vuecmf示例演示](http://www.vuecmf.com/)


## 前端：
#### v2.0.x:
github https://github.com/vuecmf/vuecmf

gitee  https://gitee.com/emei/vuecmf

#### v2.1.x:
github https://github.com/vuecmf/vuecmf-web

gitee https://gitee.com/emei/vuecmf-web


## 后端：

#### PHP版:
github https://github.com/vuecmf/vuecmf-php

gitee https://gitee.com/emei/vuecmf-php

#### Go版:
github https://github.com/vuecmf/vuecmf-go

gitee https://gitee.com/emei/vuecmf-go

注意：前端v2.0.x与后端v2.0.x匹配, 前端v2.1.x与后端v2.1.x匹配


注意：下面的操作是v2.0.x的安装使用，v2.1.x的使用请查看https://gitee.com/emei/vuecmf-web

# 开始使用
## 安装运行环境
第一步：安装nodejs (已安装过的则跳过此步骤)

- [下载nodejs（https://nodejs.org/zh-cn/）](https://nodejs.org/zh-cn/), 并安装完后，在命令行执行下面操作安装yarn
```
npm install -g yarn
```

第二步：安装Vue CLI 3 (已安装过的则跳过此步骤)
```
yarn global add @vue/cli
```

## 使用vuecmf模板创建项目
```
vue create --preset vuecmf/vuecmf my-project
```
my-project为你创建的项目名称，可自定义

## 运行项目
```
# 如果是开发调试，则在命令行输入下面回车
yarn dev

# 如果是发布到测试环境运行，则在命令行输入下面回车
yarn build:test

# 如果是发布生产环境运行，则在命令行输入下面回车
yarn build

```


