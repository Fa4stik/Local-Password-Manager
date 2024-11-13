import { CustomTable } from "../components/CustomTable.tsx";

export const Main = () => {

    return (
        <div className="w-full h-full">
            <CustomTable dataSource={[
              { key: '1', service: 'g', login: '123', password: '123' },
              { key: '2', service: 'd', login: '123', password: '123' },
              { key: '3', service: 'f', login: '123', password: '123' },
            ]}/>
        </div>
    );
};