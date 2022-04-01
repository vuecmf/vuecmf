// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/emei8/vuecmf-web/blob/master/LICENSE )
// +----------------------------------------------------------------------
// | Author: emei8 <2278667823@qq.com>
// +----------------------------------------------------------------------


import BaseEvent from "@/service/event/BaseEvent";


export default class DefaultEvent extends BaseEvent{
    constructor() {
        super({}, {});

        //表格事件配置
        this.table_event.tool_event = [

        ]

    }

}