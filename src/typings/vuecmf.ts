// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

export interface Tag {
    title: string,
    path: string
}

export interface AnyObject {
    [key: string]: any
}

export interface RouterObject {
    key: string,
    path: Array<string>
}





