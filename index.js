import axios from 'axios'
import cheerio from 'cheerio'
import mdIt from 'markdown-it'
import fs from 'fs'
let md = new mdIt()


async function getData() {
  let tagArray = await axios.get('http://es6.ruanyifeng.com/sidebar.md').then(res => {
    let { data } = res
    let reg = new RegExp('(docs/[a-zA-Z\d\-]+)','g')
    return data.match(reg).slice(0, -1)
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

var storeData = (data) => {
  let head = `
  <html>
    <head>
    <meta charset="utf-8">
    <title>ECMAScript简易教程</title>
    <style>
      pre {
        background-color: #efefef;
      }
    </style>
    </head>
    <body>
  `
  let foot = '</body></html>'
  let dataString = md.render(data.join('\n'))
  fs.writeFileSync('lala.html', head + dataString + foot)
}
getData().then(function (res) {
  storeData(res)
  
}).catch(err=> {
  console.log(err)
})