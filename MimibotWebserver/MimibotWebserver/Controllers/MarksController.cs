using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimibotWebserver.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace MimibotWebserver.Controllers
{
    [AllowAnonymous]
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class MarksController : ControllerBase
    {
        private readonly Context _context;

        public MarksController(Context context)
        {
            _context = context;
        }

        // GET: api/Marks
        [AllowAnonymous]
        [EnableCors("MyPolicy")]
        [HttpGet]
        public IEnumerable<Mark> GetMark()
        {
            return _context.Mark;
        }

        // GET: api/Marks/5
        [AllowAnonymous]
        [EnableCors("MyPolicy")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMark([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mark = await _context.Mark.FindAsync(id);

            if (mark == null)
            {
                return NotFound();
            }

            return Ok(mark);
        }

        // PUT: api/Marks/5
        [AllowAnonymous]
        [EnableCors("MyPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMark([FromRoute] string id, [FromBody] Mark mark)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != mark.MarkId)
            {
                return BadRequest();
            }

            _context.Entry(mark).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MarkExists(id))
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

        // POST: api/Marks
        [AllowAnonymous]
        [EnableCors("MyPolicy")]
        [HttpPost]
        public async Task<IActionResult> PostMark([FromBody] Mark mark)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Mark.Add(mark);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMark", new { id = mark.MarkId }, mark);
        }

        // DELETE: api/Marks/5
        [AllowAnonymous]
        [EnableCors("MyPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMark([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var mark = await _context.Mark.FindAsync(id);
            if (mark == null)
            {
                return NotFound();
            }

            _context.Mark.Remove(mark);
            await _context.SaveChangesAsync();

            return Ok(mark);
        }

        private bool MarkExists(string id)
        {
            return _context.Mark.Any(e => e.MarkId == id);
        }
    }
}