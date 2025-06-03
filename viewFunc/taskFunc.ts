import api from '@/services/api';
import { Task } from '@/types';
import { ref, onMounted } from "vue";
import { PreferencesService } from '@/services/preferencesService';
import { useRouter } from 'vue-router';
import { handleAuthError } from '@/utils/authUtils';

export function taskFunc() {
    const router = useRouter();
    const tasks = ref<Task[]>([]);
    const completedTasks = ref<Task[]>([]);
    const incompleteTasks = ref<Task[]>([]);
    const visitedTasks = ref<Set<number>>(new Set());
    const completedTaskReward = ref<number>(0);
    const showAlert = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const showError = ref<boolean>(false);
    const errorMessage = ref<string>("");
    const taskCompletionStatus = ref<Map<number, boolean>>(new Map());

    const fetchTasks = async () => {
        isLoading.value = true;
        const theUserId = await PreferencesService.get('userId');

        if (!theUserId) {
            await handleAuthError(new Error('User ID not found'), router);
            showError.value = true;
            errorMessage.value = 'Session is expired please login';
            return;
        }

        isLoading.value = true;
        try {
            const response = await api.get<Task[]>('/tasks', {
                params: { userId: theUserId }
            });
            tasks.value = response.data;

            const userId = parseInt(theUserId);
            // Filter tasks based on completion status
            incompleteTasks.value = tasks.value.filter(task => {
                const completedUsers = task.users_com_task || [];
                return !completedUsers.includes(userId);
            });

            completedTasks.value = tasks.value.filter(task => {
                const completedUsers = task.users_com_task || [];
                return completedUsers.includes(userId);
            });

            // Update completion status for all tasks
            await Promise.all(tasks.value.map(task => updateTaskStatus(task.task_id)));

        } catch (error: any) {
            if (error.response?.status === 401 || !await PreferencesService.get('userId')) {
                await handleAuthError(error, router);
            } else {
                //console.error(error.response?.data?.details, error.message)
                errorMessage.value = 'Something Went wrong, pleasetry again later';
                showError.value = true;
            }
        } finally {
            isLoading.value = false;
        }
    };

    const isTaskCompleted = async  (taskId: number): Promise<boolean> => {
        const userIdStr =  await PreferencesService.get('userId');
        const userId = userIdStr ? parseInt(userIdStr) : 0;
        const task = tasks.value.find(t => t.task_id === taskId);
        return task?.users_com_task?.includes(userId) || false;
    };

    const updateTaskStatus = async (taskId: number) => {
        const completed = await isTaskCompleted(taskId);
        taskCompletionStatus.value.set(taskId, completed);
    };

    const getTaskStatus = (taskId: number): boolean => {
        return taskCompletionStatus.value.get(taskId) || false;
    };

    const hasVisitedTask = (taskId: number): boolean => {
        return visitedTasks.value.has(taskId);
    };

    const goToTask = (task: Task) => {
        if (task.task_link) {
            window.open(task.task_link, '_blank', 'noopener');
            visitedTasks.value.add(task.task_id);
        }
    };

    const claimReward = async (task: Task) => {
        isLoading.value = true;
        try {
            const userId = await PreferencesService.get('userId');

            if (!userId) {
                await handleAuthError(new Error('User ID not found'), router);
                showError.value = true;
                errorMessage.value = 'Session is expired please login';
                return;
            }

            const response = await api.post(`/tasks/${task.task_id}/complete`, {
                userId: parseInt(userId)
            });

            if (response.data?.message === "Task completed successfully") {
                completedTaskReward.value = task.task_point;
                showAlert.value = true;
                visitedTasks.value.delete(task.task_id);
                await fetchTasks();
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (error: any) {
            //console.error('Task completion error:', error);
            errorMessage.value = 'Something went Wrong';
            showError.value = true;
        } finally {
            isLoading.value = false;
        }
    };

    const completeTask = async (task: Task) => {
        isLoading.value = true;
        try {
            const userId = await PreferencesService.get('userId');

            if (!userId) {
                await handleAuthError(new Error('User ID not found'), router);
                showError.value = true;
                errorMessage.value = 'Session is expired please login';
                return;            
            }

            if (task.task_link) {
                window.open(task.task_link, '_blank', 'noopener');
            }

            const response = await api.post(`/tasks/${task.task_id}/complete`, {
                userId: parseInt(userId)
            });

            if (response.data?.message === "Task completed successfully") {
                completedTaskReward.value = task.task_point;
                showAlert.value = true;
                await fetchTasks();
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (error: any) {
            //console.error('Task completion error:', error);
            errorMessage.value = 'Something Went wrong';
            showError.value = true;
        } finally {
            isLoading.value = false;
        }
    };

    const handleTaskAction = async (task: Task) => {
        if (await isTaskCompleted(task.task_id)) {
            return;
        }
        await completeTask(task);
    };

    onMounted(() => {
        fetchTasks();
    });

    return {
        goToTask,
        claimReward,
        hasVisitedTask,
        completeTask,
        incompleteTasks,
        completedTasks,
        isTaskCompleted,
        isLoading,
        showAlert,
        completedTaskReward,
        showError,
        errorMessage,
        handleTaskAction,
        getTaskStatus
    };
}