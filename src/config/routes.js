import NotFoundPage from '../components/main/NotFoundPage';
import Login from '../components/login/Login';
import Register from '../components/login/Register';
import PasswordResetPage from '../components/login/PasswordResetPage';
import Overview from "../components/main/Overview";
import PostNew from "../components/post/PostNew";
import PostModify from "../components/post/PostModify";
import PostView from "../components/post/PostView";
import PostList from "../components/main/PostList";
import TagList from "../components/main/TagList";
import TagView from "../components/tag/TagView";
import FavoritePostList from "../components/main/FavoritePostList";
import Trash from "../components/main/Trash";
import PasswordResetConfirmPage from "../components/login/PasswordResetConfirmPage";

const routes = [
    {path: '/register', component: Register},
    {path: '/login', component: Login},
    {path: '/password-reset', component: PasswordResetPage},
    {path: '/password-reset/confirm', component: PasswordResetConfirmPage},

    {path: '/overview', component: Overview},
    {path: '/posts', component: PostList},
    {path: '/tags', component: TagList},
    {path: '/trash', component: Trash},
    {path: '/favorites', component: FavoritePostList},

    {path: '/post/:name', component: PostView},
    {path: '/post/:name/modify', component: PostModify},
    {path: '/tag/:name', component: TagView},
    {path: '/posts/new', component: PostNew},

    {path: '*', component: NotFoundPage},
];

export default routes;
