import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'

async function getData () {
  let tagArray = await axios.get('https://nodejs.org/dist/latest-v7.x/docs/api/').then(res => {
    let { data } = res
    let $ = cheerio.load(data)
    let tagLen = $('#column2 ul li a').length
    let arr = []
    for (var i = 0; i < tagLen-2; i ++) {
      arr.push($('#column2 ul li a').eq(i).attr('href'))
    }
    return arr
  })
  let pms = tagArray.map(el => {
    return axios.get(`https://nodejs.org/dist/latest-v7.x/docs/api/${el}`).then(res => {
      let { data } = res
      let $ = cheerio.load(data)
      return $('#apicontent').html()
    })
  })
  let articleData = await Promise.all(pms).then(posts => {
    return posts
  })
  return articleData
}

var readFile = function (path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf-8', function(err, data) {
	    if(err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
var storeData = async function(data) {
  let styleDoc = await readFile('./style.css')
  let head = `
  <html>
    <head>
    <meta charset="utf-8">
    <title>Nodejs V7 文档</title>
    <style>
      ${styleDoc}
    </style>
    </head>
    <body>
  `
  let foot = '</body></html>'
  let dataString = data.join('\n')
  fs.writeFileSync('nodejs_v7.html', head + dataString + foot)
}
getData().then(res => {
  storeData(res)
}).catch(err => {
  console.log(err)
})
