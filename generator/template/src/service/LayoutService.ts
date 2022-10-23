// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import BaseService from "./BaseService"
import {AnyObject, Tag} from "@/typings/vuecmf"
import LayoutModel from "@/model/LayoutModel"
import {computed, nextTick, onMounted} from "vue"
import router from "@/router"
import store from '@/store'
import {ElMessage} from "element-plus";

/**
 * 布局服务类
 */
export default class LayoutService extends BaseService{
    breadcrumb_list = this.ref()              // 面包屑内容列表
    nav_menu_list = this.ref<AnyObject>()     // 头部菜单列表
    is_ellipsis = this.ref(false)       // 头部菜单是否显示省略号
    main_menu_active = this.ref('')     // 头部菜单当前选中索引

    aside_width = this.ref("200px")     // 左侧菜单区域宽度
    aside_menu_list = this.ref<AnyObject>()   // 左侧菜单列表
    is_side_collapse = this.ref(false)  // 左侧菜单是否折叠
    aside_menu_active = this.ref('')    // 左侧菜单当前选中索引

    vuecmf_tabs = this.ref()                  // vuecmf_tabs DOM引用
    current_tab_index = this.ref(0)     // 当前选中标签索引
    left_disabled = this.ref(false)     // 标签导航左箭头按钮是否可用
    right_disabled = this.ref(true)     // 标签导航右箭头按钮是否可用
    tag_width = this.ref(0)             // 单个标签宽度
    scroll_nun = this.ref(0)            // 标签滚动个数
    // 标签列表
    tags_list = this.ref<AnyObject>([{ title: '欢迎页', path: 'welcome' }])
    // 标签导航滚动的左右滚动的总位置
    scroll_x = computed(() => this.scroll_nun.value * this.tag_width.value )

    //页面更新区域KEY
    view_key = computed(() => router.currentRoute.value.name as string)


    constructor() {
        super();
    }


    /**
     * 加载菜单数据
     */
    loadMenu = ():Promise<string | void> => {
        const lay = new LayoutModel()
        return lay.getNavMenu().then((res: AnyObject) =>{
            this.nav_menu_list.value = res.data.nav_menu
            store.dispatch('setNavMenuList', res.data.nav_menu)
            store.dispatch('setApiMaps', res.data.api_maps)

            //加载路由
            this.loadRouter(this.nav_menu_list.value)

            nextTick(() => {
                //默认第一个主菜单项选中
                if(typeof this.nav_menu_list.value != 'undefined'){
                    const main_menu_keys = Object.keys(this.nav_menu_list.value)
                    if(main_menu_keys.length > 0) {
                        this.main_menu_active.value = this.nav_menu_list.value[main_menu_keys[0]].mid
                        this.selectMainMenu(this.main_menu_active.value)
                    }
                }
            })

            return Promise.resolve('router loaded')

        }).catch((res) => {
            if(res.code == 1003){
                this.vuecmfException(res.msg)
            }else if(res.msg != undefined){
                ElMessage.error(res.msg)
                return Promise.reject('')
            }else{
                console.log(res)
                ElMessage.error(res.toString())
                return Promise.reject('')
            }

        })
    }


    /**
     * 加载路由
     * @param menuList  菜单列表数据
     */
    loadRouter = (menuList: AnyObject|undefined):void => {
        if(typeof menuList != 'undefined'){
            for(const key in menuList){
                if(typeof menuList[key].children != 'undefined' && menuList[key].children != null){
                    this.loadRouter(menuList[key].children)
                }else{
                    router.addRoute('home', {
                        path: menuList[key].mid,
                        component: () => import('@/views/' + menuList[key].component_tpl),
                        name: menuList[key].title,
                        meta: {
                            default_action_type: menuList[key].default_action_type, //模型的默认动作类型
                            table_name: menuList[key].table_name,  //模型表名
                            breadcrumb_list: menuList[key].path_name, //当前菜单路径
                            title: menuList[key].title,         //当前菜单标题
                            top_mid: menuList[key].id_path[0],  //当前菜单的顶级菜单ID
                            is_tree: menuList[key].is_tree, //当前模型是否为目录树， 10=是， 20=否

                            transition: 'fadeIn',
                            noCache: true,
                        }
                    })
                }
            }
        }

    }


    /**
     * 关闭标签页
     * @param tag 标签页信息
     */
    closeTag = (tag: Tag):void => {
        this.tags_list.value.splice(this.tags_list.value.indexOf(tag), 1)
        if(typeof this.tags_list.value[this.current_tab_index.value] == 'undefined') this.current_tab_index.value = this.tags_list.value.length - 1

        const current_tab = this.tags_list.value[this.current_tab_index.value]
        this.aside_menu_active.value = current_tab.path
        router.push('/' + current_tab.path)
        setTimeout(()=> {
            this.setBreadcrumbList()
        }, 200)

    }

    /**
     * 设置当前选中的Tab在可见区域
     */
    private tabVisible = ():void => {
        if(this.vuecmf_tabs.value == undefined) return
        const tabs_main_width = this.vuecmf_tabs.value.$refs.vuecmf_tabs_main.offsetWidth
        if((this.current_tab_index.value as number + 1) * this.tag_width.value > tabs_main_width){
            this.scroll_nun.value = -(this.current_tab_index.value as number )
            this.right_disabled.value = false
        }else{
            this.scroll_nun.value = 0
            this.right_disabled.value = true
        }
    }


    /**
     * 选择标签页
     * @param tag 标签页信息
     */
    selectTab = (tag: AnyObject):void => {
        let tag_id = tag.target.id
        if(tag_id == '') tag_id = tag.target.offsetParent.id

        const tmp_title = tag_id.replace('vucmf_tag_','')
        const tmp_title_arr = tmp_title.split('_')
        this.current_tab_index.value = parseInt(tmp_title_arr[1])
        this.aside_menu_active.value = tmp_title_arr[0]
        router.push('/' + tmp_title_arr[0])
        setTimeout(()=> {
            this.setBreadcrumbList()
        }, 200)

        //如果当前标签在标签区域外不可见，则将其滚动到可见区域
        this.tabVisible()

    }


    /**
     * 添加标签页
     */
    addTab = ():boolean => {
        if(typeof router.currentRoute == 'undefined') return false

        setTimeout(()=>{
            const current_route = router.currentRoute.value
            const title = current_route.name
            const path = current_route.path.replace('/','')
            const main_menu_index = current_route.meta.top_mid as string

            this.selectMainMenu(main_menu_index)

            let is_exist = false
            this.tags_list.value.forEach((item:Tag, index: number)=>{
                if(item.path === path){
                    is_exist = true
                    this.current_tab_index.value = index
                    this.tabVisible()
                    return true
                }
            })

            if(!is_exist){
                this.tags_list.value.push({title: title, path: path})
                this.current_tab_index.value = this.tags_list.value.length - 1
                this.tabVisible()
            }

            //保持当前主菜单和侧边菜单的选中状态
            setTimeout(()=>{
                this.main_menu_active.value = main_menu_index
                this.aside_menu_active.value = path
            }, 200)

            this.autoTabArrow()

        }, 300)
        return true
    }


    /**
     * 标签页管理菜单
     * @param command 事件名称
     */
    manageVuecmfTabs = (command: string):void => {
        switch (command){
            case 'close-left':
                this.tags_list.value = this.tags_list.value.filter((tab:Tag,index: number) => (index >= this.current_tab_index.value || tab.title == '欢迎页'));
                if(this.current_tab_index.value != 0) this.current_tab_index.value = 1
                break;
            case 'close-right':
                this.tags_list.value = this.tags_list.value.filter((tab:Tag,index: number) => (index <= this.current_tab_index.value || tab.title == '欢迎页'));
                break;
            case 'close-current':
                if(this.current_tab_index.value != 0) this.closeTag(this.tags_list.value[this.current_tab_index.value])
                break;
            case 'close-no-current':
                this.tags_list.value = this.tags_list.value.filter((tab:Tag,index: number) => (index == this.current_tab_index.value || tab.title == '欢迎页'));
                if(this.current_tab_index.value != 0) this.current_tab_index.value = 1
                break;
            default:
                this.current_tab_index.value = 0
                this.tags_list.value = [{ title: '欢迎页', path: 'welcome' }]
        }
        this.tabVisible()
    }


    /**
     * tab左右箭头状态处理
     * @param event_name  事件名
     */
    autoTabArrow = (event_name?: string):void => {
        if(this.vuecmf_tabs.value == undefined) return
        const tabs_wrap_width = this.vuecmf_tabs.value.$refs.vuecmf_tabs_wrap.offsetWidth
        const tabs_main_width = this.vuecmf_tabs.value.$refs.vuecmf_tabs_main.offsetWidth

        if(tabs_wrap_width < tabs_main_width || Math.abs(this.scroll_x.value) > (tabs_wrap_width - tabs_main_width)){
            //左箭头变灰不可用
            this.left_disabled.value = true
            if(this.scroll_x.value < 0) this.right_disabled.value = false
        }else{
            //右箭头变灰不可用
            this.right_disabled.value = this.scroll_x.value >= 0
            this.left_disabled.value = false
        }

        if(event_name == 'left' && this.left_disabled.value == false){
            if(this.scroll_nun.value >= 0){
                this.right_disabled.value = false
            }else{
                this.left_disabled.value = true
            }
            this.scroll_nun.value --
        }

        if(event_name == 'right' && this.right_disabled.value == false){
            if(this.scroll_nun.value >= -1) this.right_disabled.value = true
            this.scroll_nun.value ++
        }
    }


    /**
     * 左箭头事件
     */
    scrollLeft = ():void => {
        this.autoTabArrow('left')
    }


    /**
     * 右箭头事件
     */
    scrollRight = ():void => {
        this.autoTabArrow('right')
    }


    /**
     * 自适应屏幕处理
     * @param event_name 事件名称
     */
    autoMatchScreen = (event_name?: string):void => {
        if((event_name == 'aside' && !this.is_side_collapse.value) || (event_name != 'aside' && document.documentElement.clientWidth < 648)){
            this.aside_width.value = '46px'
            this.is_ellipsis.value = true
            this.is_side_collapse.value = true
        }else{
            this.aside_width.value = '200px'
            this.is_ellipsis.value = false
            this.is_side_collapse.value = false
        }
    }


    /**
     * 左侧菜单展开与折叠
     */
    collapse = ():void => {
        this.autoMatchScreen('aside')
        setTimeout(()=>{
            this.autoTabArrow()
        }, 300)
    }


    /**
     * 全屏
     */
    fullScreen = ():void => {
        const el = document.documentElement;
        const rfs = el.requestFullscreen;
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        }
        return;
    }


    /**
     * 刷新当前标签页内容
     */
    reloadTabPage = ():void => {
        sessionStorage.clear()
        router.replace({
            path: '/refresh',
            query: {}
        })
    }


    /**
     * 选择主菜单
     * @param index  菜单索引值
     */
    selectMainMenu = (index: string):void => {
        //加载侧边菜单
        if(this.nav_menu_list.value != undefined) {
            Object.keys(this.nav_menu_list.value).forEach((key) => {
                if(this.nav_menu_list.value != undefined && this.nav_menu_list.value[key] != undefined && this.nav_menu_list.value[key].mid == index){
                    this.aside_menu_list.value = this.nav_menu_list.value[key].children
                }
            })
        }
        //加载面包屑列表
        this.setBreadcrumbList()
    }


    /**
     * 设置面包屑列表
     */
    setBreadcrumbList = ():void => {
        this.breadcrumb_list.value = router.currentRoute.value.meta.breadcrumb_list
    }


    /**
     * 实例挂载完后，页面显示初始化
     */
    init = ():void => {
        //加载菜单数据
        this.loadMenu()

        onMounted(() => {
            //初始化标签列表
            this.addTab()

            this.autoMatchScreen()
            this.autoTabArrow()
            //监听标签外层宽度
            window.onresize = () => {
                this.autoMatchScreen()
                this.autoTabArrow()
            }

            nextTick(() => {
                //获取单个tag平均宽度
                this.tag_width.value = Math.ceil(this.vuecmf_tabs.value.$refs.vuecmf_tabs_wrap.offsetWidth / this.tags_list.value.length)
                //加载面包屑列表
                this.setBreadcrumbList()
            })

        })
    }


}
