using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimibotWebserver.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace MimibotWebserver.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("MyPolicy")]
    [AllowAnonymous]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly Context _context;

        public UploadsController(Context context)
        {
            _context = context;
        }

        // GET: api/Uploads
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        [HttpGet]
        public IEnumerable<Upload> GetUploads()
        {
            return _context.Uploads;
        }

        // GET: api/Uploads/5
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUpload([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var upload = await _context.Uploads.FindAsync(id);

            if (upload == null)
            {
                return NotFound();
            }

            return Ok(upload);
        }

        // PUT: api/Uploads/5
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUpload([FromRoute] string id, [FromBody] Upload upload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != upload.UploadId)
            {
                return BadRequest();
            }

            _context.Entry(upload).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UploadExists(id))
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

        // POST: api/Uploads
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> PostUpload([FromBody] Upload upload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Uploads.Add(upload);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUpload", new { id = upload.UploadId }, upload);
        }

        // DELETE: api/Uploads/5
        [EnableCors("MyPolicy")]
        [AllowAnonymous]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUpload([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var upload = await _context.Uploads.FindAsync(id);
            if (upload == null)
            {
                return NotFound();
            }

            _context.Uploads.Remove(upload);
            await _context.SaveChangesAsync();

            return Ok(upload);
        }

        private bool UploadExists(string id)
        {
            return _context.Uploads.Any(e => e.UploadId == id);
        }
    }
}