import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Header } from '../components/Header';
import { Task, TasksList } from '../components/TasksList';
import { TodoInput } from '../components/TodoInput';

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask(newTaskTitle: string) {
    setTasks([...tasks, { title: newTaskTitle, id: new Date().getTime(), done: false }])
  }

  function handleToggleTaskDone(id: number) {
    const tasksUpdated = tasks.map(task => task.id === id ? { ...task, done: !task.done } : task)
    setTasks(tasksUpdated)
  }

  function handleRemoveTask(id: number) {
    const tasksFiltereds = tasks.filter(task => task.id !== id)
    setTasks(tasksFiltereds)
  }

  return (
    <View style={styles.container}>
      <Header tasksCounter={tasks.length} />

      <TodoInput addTask={handleAddTask} />

      <TasksList 
        tasks={tasks} 
        toggleTaskDone={handleToggleTaskDone}
        removeTask={handleRemoveTask} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB'
  }
})