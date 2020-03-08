import {ajax, storage} from "../config";

export function createPost({title, style, name, published, favorite, summary, tags, content}) {
    return ajax.post({
        url: '/post',
        data: {title, style, name, published, favorite, summary, tags, content}
    });
}

export function deletePost({id, name}) {
    return ajax.del({
        url: '/post',
        data: {id, name}
    });
}

export function updatePost({id, title, style, name, published, favorite, summary, tags, content}) {
    return ajax.put({
        url: `/post`,
        data: {id, title, style, name, published, favorite, summary, tags, content}
    });
}

export function getPost({id, name}) {
    return ajax.get({
        url: '/post',
        params: {id, name}
    });
}

///

export function createTag({name, favorite}) {
    return ajax.post({
        url: '/tag',
        data: {name, favorite}
    });
}

export function deleteTag(id) {
    return ajax.del({
        url: '/tag',
        data: {
            id: id,
        }
    });
}

export function updateTag({id, name, favorite}) {
    return ajax.put({
        url: `/tag`,
        data: {id, name, favorite}
    });
}

export function getTag({name, page, size}) {
    return ajax.get({
        url: '/tag',
        params: {name, page, size}
    });
}

///

export function getPostNameValidity(name) {
    return ajax.get({
        url: '/post/name/validity',
        params: {
            name: name,
        }
    });
}

export function getTagNameValidity(name) {
    return ajax.get({
        url: '/tag/name/validity',
        params: {
            name: name,
        }
    });
}

export function removePostFromTag({tagId, postId}) {
    return ajax.del({
        url: '/tag/remove/post',
        data: {tagId, postId}
    });
}

///

export function getPostList({page, size}) {
    return ajax.get({
        url: '/post/list',
        params: {page, size},
    });
}

export function getTagList({page, size}) {
    return ajax.get({
        url: '/tag/list',
        params: {page, size},
    });
}

export function getPostFavoriteList({page, size}) {
    return ajax.get({
        url: '/post/favorite/list',
        params: {page, size},
    });
}

export function getPostDeletedList({page, size}) {
    return ajax.get({
        url: '/post/deleted/list',
        params: {page, size},
    });
}

export function restorePost(id) {
    return ajax.post({
        url: '/post/restore',
        params: {id},
    });
}

//// //// ////    //// //// ////    //// //// ////    //// //// ////    //// //// ////

export function checkPostFormOrSetState(refer) {
    let {title, name, summary, content} = refer.state;
    if (!title || title.length < 4 || title.length > 128) {
        refer.setState({error: "Required length of title is in [4,128]"});
        return;
    }
    if (!name || name.length < 4 || name.length > 128) {
        refer.setState({error: "Required length of name is in [4,128]"});
        return;
    }
    // <= 1kB, about 300 uft8 chars
    if (!summary || summary.length < 16 || summary.length > 1024) {
        refer.setState({error: "Required length of summary is in [16,1024]"});
        return;
    }
    // <= 64KB, about 20,000 utf8 chars
    if (!content || content.length < 64 || content.length > 65536) {
        refer.setState({error: "Required length of content is in [64,65536]"});
        return;
    }
    return true;
}

export function isFavoriteTag(name) {
    const user = storage.getUser();
    if (!user) {
        return false;
    }
    const favoriteTags = user.favoriteTags.map(it => it.name);
    return favoriteTags.indexOf(name) !== -1;
}
