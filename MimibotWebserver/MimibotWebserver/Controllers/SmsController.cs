using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimibotWebserver.Models;

namespace MimibotWebserver.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SmsController : ControllerBase
    {
        private readonly Context _context;

        public SmsController(Context context)
        {
            _context = context;
        }

        // GET: api/Sms
        [HttpGet]
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        public IEnumerable<Sms> GetSms()
        {
            return _context.Sms;
        }

        // GET: api/Sms/5
        [HttpGet("{id}")]
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSms([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sms = await _context.Sms.FindAsync(id);

            if (sms == null)
            {
                return NotFound();
            }

            return Ok(sms);
        }

        // PUT: api/Sms/5
        [HttpPut("{id}")]
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        public async Task<IActionResult> PutSms([FromRoute] string id, [FromBody] Sms sms)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != sms.SmsId)
            {
                return BadRequest();
            }

            _context.Entry(sms).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SmsExists(id))
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

        // POST: api/Sms
        [HttpPost]
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        public async Task<IActionResult> PostSms([FromBody] Sms sms)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Sms.Add(sms);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSms", new { id = sms.SmsId }, sms);
        }

        // DELETE: api/Sms/5
        [HttpDelete("{id}")]
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteSms([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sms = await _context.Sms.FindAsync(id);
            if (sms == null)
            {
                return NotFound();
            }

            _context.Sms.Remove(sms);
            await _context.SaveChangesAsync();

            return Ok(sms);
        }

        private bool SmsExists(string id)
        {
            return _context.Sms.Any(e => e.SmsId == id);
        }
    }
}