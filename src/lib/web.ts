import * as cheerio from 'cheerio';

export const getUrlHtml = async (url: string) => {
    const response = await fetch(url)
    const content = await response.text()
    return content
}


export const getUrlBody = async (url: string): Promise<string> => {
    console.log("get body")
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
    console.log("get body")
    const html = await getUrlHtml(url)
    try {
        const $ = cheerio.load(html);

        const lastNav = $('nav').last();

        // Get the first <div> that comes after the last <nav>
        const targetDiv = lastNav.nextAll('div').first();
      
        // Within the target div, find all <img> tags, extract their src attributes, and trim them
        const srcList: string[] = targetDiv.find('img')
              .map((_, el) => {
            const src = $(el).attr('src');
            if (!src) return undefined;
            // Split the src at "~" and return the first part (before "~")
            return src.split("~")[0];
              })
        .get()
        // Filter out any undefined values, just in case
        .filter(src => src !== undefined).filter(src => src.includes("media-api.xogrp.com")) as string[];
    
      return srcList;
    } catch (err: any) {
        console.error(err.message)
        return []
    }
}
    

