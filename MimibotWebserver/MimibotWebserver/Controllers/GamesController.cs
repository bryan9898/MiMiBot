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
    [Route("api/[controller]")]
    [EnableCors("MyPolicy")]
    [AllowAnonymous]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly Context _context;

        public GamesController(Context context)
        {
            _context = context;
        }

        // GET: api/Games
        [EnableCors("MyPolicy")]
        [HttpGet]
        public IEnumerable<Game> GetGames()
        {
            return _context.Games;
        }

        // GET: api/Games/5
        [EnableCors("MyPolicy")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGame([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var game = await _context.Games.FindAsync(id);

            if (game == null)
            {
                return NotFound();
            }

            return Ok(game);
        }

        // PUT: api/Games/5
        [EnableCors("MyPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGame([FromRoute] string id, [FromBody] Game game)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != game.GameId)
            {
                return BadRequest();
            }

            _context.Entry(game).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameExists(id))
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

        // POST: api/Games
        [EnableCors("MyPolicy")]
        [HttpPost]
        public async Task<IActionResult> PostGame([FromBody] Game game)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGame", new { id = game.GameId }, game);
        }

        // DELETE: api/Games/5\
        [EnableCors("MyPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return Ok(game);
        }

        private bool GameExists(string id)
        {
            return _context.Games.Any(e => e.GameId == id);
        }
    }
}