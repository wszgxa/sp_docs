import axios from 'axios'
import cheerio from 'cheerio'
import {Markdown as md} from 'node-markdown'


async function getData() {
  let tagArray = await axios.get('http://es6.ruanyifeng.com/sidebar.md').then(res => {
    let { data } = res
    let reg = new RegExp('(docs/[a-zA-Z\d\-]+)','g')
    return data.match(reg).slice(0, 2)
  })
  let pms = tagArray.map(function (el) {
    return axios.get(`http://es6.ruanyifeng.com/${el}.md`).then(res => {
      return res.data
    })
  })
  let articleData = await Promise.all(pms).then(posts => {
    return posts
  })
  return articleData
}

getData().then(function (res) {
  console.log(md(res[0], true))
}).catch(err=> {
  console.log(err)
})