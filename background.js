chrome.runtime.onInstalled.addListener(async function() {
    chrome.contextMenus.create({ "id": "getAllAuthors", "title": "Copy all authors' OL ID", "contexts": ["link"] })
})
chrome.contextMenus.onClicked.addListener(clickHandler);
async function copyOLIDs(ids) {
    await navigator.clipboard.writeText(ids.join(","))
}
async function clickHandler(info, tab) {
    const work_id_regex = /OL\d+W/;
    if (work_id_regex.test(info.linkUrl)) {
        const authorsID = await getAllAuthors(info.linkUrl)
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: copyOLIDs,
            args: [authorsID]
        });
    }
}

function linktoJson(url) {
    let url_parsed = new URL(url)
    url_parsed.pathname += ".json"
    return url_parsed.toString()
}

async function getAllAuthors(url) {
    const res = await fetch(linktoJson(url))
    const work = await res.json()
    return authorParsing(work)
}

function authorParsing(json) {
    return json?.authors?.map((author) => author?.author?.key?.split("/")[2]);
}
