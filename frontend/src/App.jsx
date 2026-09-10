import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const loadTickets = async () => {
    const response = await fetch("http://localhost:5000/api/tickets");
    const data = await response.json();
    setTickets(data);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const createTicket = async () => {
    const response = await fetch("http://localhost:5000/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    setMessage(`Ny biljett skapad: ${data.code}`);
    loadTickets();
  };

  const useTicket = async () => {
    const response = await fetch(
      "http://localhost:5000/api/tickets/use",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      setCode("");
      loadTickets();
    }
  };

  const deleteTicket = async (ticketCode) => {
    const response = await fetch(
      `http://localhost:5000/api/tickets/${ticketCode}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      loadTickets();
    }
  };

  return (
    <div className="container">
      <h1>Biljettsystem</h1>

      <button onClick={createTicket}>
        Skapa ny biljett
      </button>

      <div className="use-ticket">
        <input
          type="text"
          placeholder="Skriv biljettkod"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button onClick={useTicket}>
          Använd biljett
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <h2>Alla biljetter</h2>

      <div className="tickets">
        {tickets.length === 0 ? (
          <p>Det finns inga biljetter.</p>
        ) : (
          tickets.map((ticket) => (
            <div className="ticket" key={ticket.id}>
              <div>
                <strong>{ticket.code}</strong>
                <p>
                  Status:{" "}
                  {ticket.used === 1 ? "Använd" : "Oanvänd"}
                </p>
              </div>

              {ticket.used === 0 && (
                <button
                  onClick={() => deleteTicket(ticket.code)}
                >
                  Radera
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;