import axios from 'axios'
import cheerio from 'cheerio'
import mdIt from 'markdown-it'
import fs from 'fs'
let md = new mdIt()


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
  let data = md.render(res[0])
  fs.writeFileSync('lala.html', data)
}).catch(err=> {
  console.log(err)
})