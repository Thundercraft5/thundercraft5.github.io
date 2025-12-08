// InfectionTable.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import VectorArray from '../../../packages/vector-array/VectorArray'; // Assuming it's in the same folder
import styles from './index.module.scss';

const createInitialGrid = (size) => {
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      x: x + 1,
      y: y + 1,
      isActive: false,
    }))
  );
};

const InfectionTable = ({ size = 25 }) => {
  const [grid, setGrid] = useState(() => createInitialGrid(size));
  const [isSimulating, setIsSimulating] = useState(false);

  // Use refs for simulation logic to avoid re-renders on each step
  // and to prevent stale state in closures.
  const simulationStateRef = useRef({
    occupiedTiles: null,
    edgeTiles: null,
    timeoutId: null,
  });

  const center = Math.ceil(size / 2);

  // Memoize the reset function
  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    if (simulationStateRef.current.timeoutId) {
      clearTimeout(simulationStateRef.current.timeoutId);
    }
    setGrid(createInitialGrid(size));
    simulationStateRef.current = { occupiedTiles: null, edgeTiles: null, timeoutId: null };
  }, [size]);

  // The main simulation step logic
  const growStep = useCallback(() => {
    const { occupiedTiles, edgeTiles } = simulationStateRef.current;

    if (!edgeTiles || edgeTiles.length === 0) {
      setIsSimulating(false);
      return;
    }

    const entry = edgeTiles.randomEntry();
    const [x, y] = entry;

    // Update refs
    occupiedTiles.add(x, y);
    edgeTiles.delete(entry);

    // Add new neighboring edges
    const neighbors = [
      new VectorArray.Entry(x, y + 1),
      new VectorArray.Entry(x, y - 1),
      new VectorArray.Entry(x - 1, y),
      new VectorArray.Entry(x + 1, y),
    ];

    neighbors.forEach(neighbor => {
      const [nx, ny] = neighbor;
      if (nx > 0 && nx <= size && ny > 0 && ny <= size && !occupiedTiles.has(neighbor)) {
        edgeTiles.add(neighbor);
      }
    });

    // Update the grid state to trigger a re-render
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]); // Shallow copy
      newGrid[y - 1][x - 1] = { ...newGrid[y - 1][x - 1], isActive: true };
      return newGrid;
    });

    // Schedule the next step
    simulationStateRef.current.timeoutId = setTimeout(growStep, 50);

  }, [size]);

  const startSimulation = () => {
    // Reset first to ensure a clean state
    resetSimulation();

    const occupied = new VectorArray([center, center]);
    const edges = new VectorArray(
      [center, center + 1],
      [center, center - 1],
      [center - 1, center],
      [center + 1, center],
    );

    simulationStateRef.current.occupiedTiles = occupied;
    simulationStateRef.current.edgeTiles = edges;

    // Activate the center tile
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      newGrid[center - 1][center - 1] = { ...newGrid[center - 1][center - 1], isActive: true };
      return newGrid;
    });

    setIsSimulating(true);
  };

  // Effect to start the simulation loop when `isSimulating` becomes true
  useEffect(() => {
    if (isSimulating) {
      simulationStateRef.current.timeoutId = setTimeout(growStep, 50);
    }
    // Cleanup function to clear timeout when component unmounts or simulation stops
    return () => {
      if (simulationStateRef.current.timeoutId) {
        clearTimeout(simulationStateRef.current.timeoutId);
      }
    };
  }, [isSimulating, growStep]);


  return (
    <div className={styles.infectionTableWrapper}>
      <div className={styles.controls}>
        <button onClick={startSimulation} disabled={isSimulating}>
          Activate
        </button>
        <button onClick={resetSimulation}>
          Reset
        </button>
      </div>
      <table className={styles.infectionTable}>
        <tbody>
          {grid.map((row, y) => (
            <tr key={y}>
              {row.map((cell, x) => (
                <td
                  key={x}
                  className={cell.isActive ? styles.active : ''}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfectionTable;
