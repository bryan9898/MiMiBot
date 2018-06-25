using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MimibotWebserver.Models
{
    public class Speech
    {
        [Key]
        public string SpeechId { get; set; }
        public string SpeechDetails { get; set; }
        public string UserId { get; set; }
        public string Tags { get; set; }
        public string Sentiment { get; set; }
    }
}
