import axios from 'axios'
import cheerio from 'cheerio'
import fs from 'fs'

async function getData () {
  let tagArray = await axios.get('https://rails.guide/book/').then(res => {
    let { data } = res
    let $ = cheerio.load(data)
    let tagLen = $('[data-type=chapter]').length
    let arr = []
    for (var i = 0; i < tagLen; i++) {
      arr.push($('[data-type=chapter]').eq(i).children('a').attr('href'))
    }
    return arr
  })
  let pms = tagArray.map(el => {
    return axios.get(`https://rails.guide/book/${el}`).then(res => {
      let { data } = res
      let $ = cheerio.load(data)
      return $('.article').eq(0).html()
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
var storeData = async (data) => {
  let styleDoc = await readFile('./index.css')
  let head = `
  <html>
    <head>
    <meta charset="utf-8">
    <title>ECMAScript6简易教程</title>
    <style>
      ${styleDoc}
    </style>
    </head>
    <body>
  `
  let foot = '</body></html>'
  let dataString = data.join('\n')
  fs.writeFileSync('rails.html', head + dataString + foot)
}
getData().then(res => {
  storeData(res)
}).catch(err => {
  console.log(err)
})