import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Table,
    TableColumn,
    Switch,
    Col,
    Row,
    Tooltip,
    Pagination,
    Popover,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Dropdown,
    DropdownMenu,
    Select,
    Option,
    Cascader,
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Col)
Vue.use(Row)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Popover)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)


Vue.prototype.$confirm=MessageBox.confirm