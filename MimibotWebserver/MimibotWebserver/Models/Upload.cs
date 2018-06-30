using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MimibotWebserver.Models
{
    public class Upload
    {
        [Key]
        public string UploadId { get; set; }
        public string Password { get; set; }
        public string UserId { get; set; }
        public string SongLink { get; set; }
    }
}
