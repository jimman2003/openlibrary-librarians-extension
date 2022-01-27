chrome.runtime.onInstalled.addListener(function() {
chrome.contextMenus.create({"id":"getAllAuthors","title":"Get All Authors","contexts":["link"]})})
chrome.contextMenus.onClicked.addListener(getAllAuthors);

async function getAllAuthors(info,tab){
const work_id_regex = /OL\d+W/;
if (work_id_regex.test(info.linkUrl) ){
    let url=new URL(info.linkUrl)
    url.pathname+=".json"
    const res=await fetch(url.toString())
    const work = await res.json()
    const authors=work?.authors?.map((author) => author?.author?.key?.split("/")[2]);
    console.log(authors.join(","))
    }
}

