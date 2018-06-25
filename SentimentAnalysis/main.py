import indicoio
indicoio.config.api_key = '6f3382489ab2469dbf8ca6023e91eabb'

# single example
result = indicoio.emotion("I did it. I got into Grad School. Not just any program, but a GREAT program. :-)", api_key=indicoio.config.api_key );

print(result);


# batch example
#indicoio.emotion([
 #   "I did it. I got into Grad School. Not just any program, but a GREAT program. :-)",
  #  "Like seriously my life is bleak, I have been unemployed for almost a year."
#])

