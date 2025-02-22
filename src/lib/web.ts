import * as cheerio from 'cheerio';

export const getUrlHtml = async (url: string) => {
    const response = await fetch(url)
    const content = await response.text()
    return content
}


export const getUrlBody = async (url: string): Promise<string> => {
    const html = await getUrlHtml(url)
    try {
        const $ = cheerio.load(html);
  
        // Remove <script> and <style> elements from the body
        $('body script, body style, body nav, header, footer').remove();
        
        // Return the trimmed text content of the body
        return $('body').text().trim();
    } catch (err: any) {
        console.error(err.message)
        return ""
      }
    }

    export const getUrlImages = async (url: string): Promise<string[]> => {
      const html = await getUrlHtml(url);
      try {
        const $ = cheerio.load(html);
        let targetDiv;
    
        // Check if any <nav> elements exist
        const navElements = $('nav');
        if (navElements.length > 0) {
          // If found, use the first <div> following the last <nav>
          targetDiv = navElements.last().nextAll('div').first();
        } else {
          // If no <nav> is found, fallback to the entire document
          targetDiv = $('body')
        }
    
        // Within targetDiv, find all <img> tags and extract the src attributes
        const srcList: string[] = targetDiv.find('img')
          .map((_, el) => {
            let src = $(el).attr('src');
            console.log(src);
            if (!src) return undefined;
            // Split the src at "~" and return the first part
            if (src.startsWith('//')) {
              src = 'https:' + src;
            }    
            return src.split("~")[0].split("?")[0];
          })
          .get()
          // Filter out undefined values and only keep the desired image sources
          .filter(src => src !== undefined)
          .filter(src => src.includes("media-api.xogrp.com") || src.includes("images.zola.com")) as string[];
    
        console.log(srcList);
        return srcList;
      } catch (err: any) {
        console.error(err.message);
        return [];
      }
    }
    
