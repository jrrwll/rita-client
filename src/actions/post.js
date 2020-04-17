import {ajax, emitter, showError, storage} from "../config";
import {FETCH_TAGS_EVENT} from "./constants";

export function createPost({title, style, name, published, favorite, summary, tags, content}) {
    return ajax.post({
        url: '/post',
        data: {title, style, name, published, favorite, summary, tags, content}
    });
}

export function deletePost(id) {
    return ajax.del({
        url: `/post/${id}`,
    });
}

export function updatePost(id, {title, style, name, published, favorite, summary, tags, content}) {
    return ajax.put({
        url: `/post/${id}`,
        data: {title, style, name, published, favorite, summary, tags, content}
    });
}

export function getPost(id) {
    return ajax.get({
        url: `/post/${id}`,
    });
}

///

export function deleteTag(id) {
    return ajax.del({
        url: `/tag/${id}`,
    });
}

export function updateTag(id, {name, favorite}) {
    return ajax.put({
        url: `/tag/${id}`,
        data: {name, favorite}
    });
}

export function getTag(id, page, size) {
    return ajax.get({
        url: `/tag/${id}`,
        params: {page, size}
    });
}

///

export function getPostNameValidity(name) {
    return ajax.get({
        url: `/post/validity/name/${name}`,
    });
}

export function getTagNameValidity(name) {
    return ajax.get({
        url: `/tag/validity/name/${name}`,
    });
}

export function removePostFromTag({tagId, postId}) {
    return ajax.del({
        url: `/tag/${tagId}/remove/post/${postId}`,
    });
}

///

export function getPostList(page, size) {
    return ajax.get({
        url: '/post/list',
        params: {page, size},
    });
}

export function getTagList() {
    return ajax.get({
        url: '/tag/list',
    });
}

export function getPostFavoriteList(page, size) {
    return ajax.get({
        url: '/post/favorite/list',
        params: {page, size},
    });
}

export function getPostDeletedList(page, size) {
    return ajax.get({
        url: '/post/deleted/list',
        params: {page, size},
    });
}

export function restorePost(id) {
    return ajax.post({
        url: `/post/restore/${id}`,
    });
}

export function deleteRestorePost(id) {
    return ajax.del({
        url: `/post/restore/${id}`,
    });
}


//// //// ////    //// //// ////    //// //// ////    //// //// ////    //// //// ////

export function requireFetchTags() {
    const tags = storage.getTags();
    if (tags) {
        emitter.emit(FETCH_TAGS_EVENT, tags);
        return;
    }
    getTagList().then(res => {
        if (res.data.code === 0) {
            const tags = res.data.data;
            storage.setTags(tags);
            emitter.emit(FETCH_TAGS_EVENT, tags);
        } else {
            showError(res.data.message);
        }
    }, err => {
        if (ajax.isCancel(err)) {
            console.error("Duplicated request for fetching tags, it's a unexpected error!");
            return;
        }
        console.error("I failed to fetch tags, " +
            " it could be a network or server-end issue, could be my mistake!");
        console.error(err);
    });
}

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
    const tags = storage.getTags();
    if (!tags) {
        return false;
    }
    const favoriteTags = tags.map(it => it.name);
    return favoriteTags.indexOf(name) !== -1;
}
