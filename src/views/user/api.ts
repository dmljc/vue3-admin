import { request } from '@/utils/request';

export const userList = (): Promise<any> => {
    return request.get('/user/list');
};

export const createUser = (data: any): Promise<any> => {
    return request.post('/user/create', data);
};
export const deleteUser = (data: any): Promise<any> => {
    return request.delete(`/user/${data.id}`);
};
