using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MimibotWebserver.Models
{
    public class Sms
    {

        [Key]
        public string SmsId { get; set; }
        public string Details { get; set; }
        public string UserId { get; set; }
        public string Relationship { get; set; }
        public string PhoneNumber { get; set; }
    }
}
