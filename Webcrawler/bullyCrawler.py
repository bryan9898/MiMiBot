# -*- coding: utf-8 -*-
import scrapy
import random

counter = 0;
def saveIntoFile(data , fileName):
    f = open("../../BullyingDataset/" + fileName + ".txt" ,"w+");
    f.write(data);
    f.close()


class BullycrawlerSpider(scrapy.Spider):
    name = 'bullyCrawler'
    allowed_domains = ['psychforums.com']
    start_urls = ['https://www.psychforums.com/bullying/']
    counter = 0;
    number = 0;


    def parse(self, response):
        forumPageLink = response.css('a.topictitle::attr(href)').extract();
        for d in forumPageLink:
            nextData = response.urljoin(d);
            yield scrapy.Request(url=nextData , callback=self.post)
        nextLink = response.css('a.right-box.right::attr(href)').extract_first();
        if nextLink:
            nextLink = response.urljoin(nextLink);
            yield scrapy.Request(url=nextLink, callback=self.parse);


    def post(self,response):
        self.log("I just visted" + response.url);
        data = response.css('div.content').extract();
        for d in data:
            saveIntoFile(d, "bullying" + str(self.number));
            self.number = random.randint(1,30000);
            self.log(self.number)
        nextLink = response.css('a.right-box.right::attr(href)').extract_first();
        if nextLink:
            nextLink = response.urljoin(nextLink);
            yield scrapy.Request(url=nextLink, callback=self.post);