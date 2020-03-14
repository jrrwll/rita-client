import NotFound from '../components/main/NotFound';
import Login from '../components/login/Login';
import Register from '../components/login/Register';
import PasswordReset from '../components/login/PasswordReset';
import Overview from "../components/main/Overview";
import PostNew from "../components/post/PostNew";
import PostModify from "../components/post/PostModify";
import PostView from "../components/post/PostView";
import PostList from "../components/main/PostList";
import TagList from "../components/main/TagList";
import TagView from "../components/tag/TagView";
import FavoritePostList from "../components/main/FavoritePostList";
import Trash from "../components/main/Trash";
import PasswordResetConfirm from "../components/login/PasswordResetConfirm";
import RegisterConfirm from "../components/login/RegisterConfirm";

const routes = [
    {path: '/register', component: Register},
    {path: '/register/confirm', component: RegisterConfirm},
    {path: '/login', component: Login},
    {path: '/password-reset', component: PasswordReset},
    {path: '/password-reset/confirm', component: PasswordResetConfirm},

    {path: '/overview', component: Overview, redirect: ["/", "/index", "/home"]},
    {path: '/posts', component: PostList},
    {path: '/tags', component: TagList},
    {path: '/trash', component: Trash},
    {path: '/favorites', component: FavoritePostList},

    {path: '/post/:id', component: PostView},
    {path: '/post/:id/modify', component: PostModify},
    {path: '/tag/:id', component: TagView},
    {path: '/posts/new', component: PostNew},
    {path: '*', component: NotFound},
];

export default routes;
