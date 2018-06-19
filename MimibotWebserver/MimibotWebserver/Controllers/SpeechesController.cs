using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimibotWebserver.Models;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using Microsoft.AspNetCore.Cors;

namespace MimibotWebserver.Controllers
{
    [AllowAnonymous]
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class SpeechesController : ControllerBase
    {
        private readonly Context _context;

        public SpeechesController(Context context)
        {
            _context = context;
        }

        // GET: api/Speeches
        [EnableCors("MyPolicy")]
        [HttpGet]
        public IEnumerable<Speech> GetSpeechs()
        {
            return _context.Speechs;
        }

        // GET: api/Speeches/5
        [EnableCors("MyPolicy")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpeech([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var speech = await _context.Speechs.FindAsync(id);

            if (speech == null)
            {
                return NotFound();
            }

            return Ok(speech);
        }

        // PUT: api/Speeches/5
        [EnableCors("MyPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpeech([FromRoute] string id, [FromBody] Speech speech)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != speech.SpeechId)
            {
                return BadRequest();
            }

            _context.Entry(speech).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpeechExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Speeches
        [EnableCors("MyPolicy")]
        [HttpPost]
        public async Task<IActionResult> PostSpeech([FromBody] Speech speech)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await client.GetAsync("https://hoggersoh.pythonanywhere.com/" + speech.SpeechDetails);
            var responseString = await response.Content.ReadAsStringAsync();
            speech.Tags = responseString;
            _context.Speechs.Add(speech);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSpeech", new { id = speech.SpeechId }, speech);
        }


        HttpClient client = new HttpClient();
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        [HttpPost("topics/{content}")]
        public async Task<IActionResult> getTopicsAsync(string content)
        {
            var response = await client.GetAsync("https://hoggersoh.pythonanywhere.com/" + content);
            var responseString = await response.Content.ReadAsStringAsync();
            return Ok(responseString);

        }

        // DELETE: api/Speeches/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpeech([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var speech = await _context.Speechs.FindAsync(id);
            if (speech == null)
            {
                return NotFound();
            }

            _context.Speechs.Remove(speech);
            await _context.SaveChangesAsync();

            return Ok(speech);
        }

        private bool SpeechExists(string id)
        {
            return _context.Speechs.Any(e => e.SpeechId == id);
        }
    }
}