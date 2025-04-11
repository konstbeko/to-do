// src/app/page.tsx
"use client";
import { useState, useEffect } from "react";

// Definiere den Typ für Aufgaben
interface Task {
    id: number;
    text: string;
}

// Hilfsfunktion, um Sekunden in "mm:ss" zu formatieren
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function Timer() {
    // Der Timer arbeitet intern mit Sekunden
    const [time, setTime] = useState<number>(0); // verbleibende Zeit in Sekunden
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<number>(0); // Eingabe in Minuten
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<number>(0); // gelaufene Zeit in Sekunden (nur aktive Zeit)

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else if (time <= 0 && hasStarted && isRunning) {
            // Timer beenden, wenn 0 erreicht wird
            setIsRunning(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, time, hasStarted]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Eingabewert (in Minuten) in eine Zahl konvertieren
        setInputValue(Number(e.target.value));
    };

    const startTimer = () => {
        if (inputValue > 0) {
            const initialSeconds = inputValue * 60; // Umrechnung in Sekunden
            setTime(initialSeconds);
            setElapsedTime(0);
            setIsRunning(true);
            setHasStarted(true);
        }
    };

    const pauseResumeTimer = () => {
        setIsRunning(!isRunning);
    };

    return (
        <div className="flex flex-col items-start space-y-2 p-2 border rounded shadow-sm">
            {hasStarted && time > 0 ? (
                <div className="text-lg font-mono">
                    Restzeit (Min:Sek): {formatTime(time)}
                </div>
            ) : hasStarted && time <= 0 ? (
                // Fertig-Zustand: Pastellgrünes Feld mit der gelaufenen aktiven Zeit
                <div className="w-full p-2 bg-green-100 rounded text-green-800">
                    Fertig! Der Timer lief für (Min:Sek):{" "}
                    {formatTime(elapsedTime)}
                </div>
            ) : null}
            {/* Anzeige des Eingabefelds oder des Pause/Resume-Buttons */}
            {!hasStarted ? (
                <div className="flex items-center space-x-2">
                    <div className="flex flex-col">
                        <label className="text-sm">
                            Eingabezeit in Minuten
                        </label>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="border p-1 rounded w-24 mt-1"
                            placeholder="z.B. 5"
                        />
                    </div>
                    <button
                        onClick={startTimer}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Start
                    </button>
                </div>
            ) : hasStarted && time > 0 ? (
                <button
                    onClick={pauseResumeTimer}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    {isRunning ? "Pause" : "Resume"}
                </button>
            ) : null}
        </div>
    );
}

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");

    const addTask = () => {
        if (newTask.trim() !== "") {
            const task: Task = { id: Date.now(), text: newTask };
            setTasks([...tasks, task]);
            setNewTask("");
        }
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4">To‑Do</h1>
                {/* Eingabefeld und Button zum Hinzufügen einer neuen Aufgabe */}
                <div className="mb-4 flex">
                    <input
                        type="text"
                        placeholder="Aufgabe eingeben..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-grow border p-2 rounded-l"
                    />
                    <button
                        onClick={addTask}
                        className="bg-green-500 text-white px-4 rounded-r hover:bg-green-600"
                    >
                        Hinzufügen
                    </button>
                </div>
                {/* Aufgabenliste: Jede Aufgabe wird mit zugehörigem Timer und Löschbutton dargestellt */}
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="border p-4 rounded flex flex-col space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="font-medium">{task.text}</h2>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Löschen
                                </button>
                            </div>
                            <Timer />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
