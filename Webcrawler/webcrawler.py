import scrapy


counter = 0;
def saveIntoFile(data , fileName):
    f = open("../../sad/ " +  fileName + ".txt" , "d+");
    f.write(data);
    f.close()


class BullycrawlerSpider(scrapy.Spider):
    name = 'bullyCrawler'
    allowed_domains = ['depressionforums.org']
    start_urls = ['https://www.depressionforums.org/forums/']
    counter = 0;
    number = 0;

    def login(self,response):
        return scrapy.FormRequest.from_response(
            response,
            formdata={'username': 'project', 'password': 'iwanttodie'},
            callback=self.parse
        )

    def parse(self, response):
        self.log("does this work")

        self.login = True
        forumPageLink = response.css('h4.ipsDataItem_title.ipsType_large.ipsType_break > a::attr(href)').extract()
        for d in forumPageLink:
            nextData = response.urljoin(d);
            yield scrapy.Request(url=nextData , callback=self.parse2)



    def parse2(self,response):
        nextLink = response.css('span.ipsType_break.ipsContained > a::attr(href)').extract();
        for d in nextLink:
            nextData = response.urljoin(d);
            yield scrapy.Request(url=nextData , callback=self.post)
        nextLink = response.css('ul.ipsPagination > li.ipsPagination_next > a::attr(href) ').extract_first()
        if nextLink:
            nextLink = response.urljoin(nextLink);
            yield scrapy.Request(url=nextLink, callback=self.parse2);

    def post(self,response):
        self.log("I just visted" + response.url);
        data = response.css('div.ipsType_normal.ipsType_richText.ipsContained').extract()
        for d in data:
            if(self.number.)
            saveIntoFile(d, "depression" + str(self.number));
            self.number = self.number + 1;
        nextLink = response.css('ul.ipsPagination > li.ipsPagination_next > a::attr(href) ').extract_first();
        if nextLink:
            nextLink = response.urljoin(nextLink);
            yield scrapy.Request(url=nextLink, callback=self.post);
