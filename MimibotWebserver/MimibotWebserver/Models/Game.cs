using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MimibotWebserver.Models
{
    public class Game
    {
        [Key]
        public string GameId { get; set; }
        public string Questions { get; set; }
        public string Answers { get; set; }

    }
}
