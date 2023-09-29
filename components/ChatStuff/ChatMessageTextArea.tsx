import BouncingDots from './BouncingDots';
import { BiSend } from "react-icons/bi";

interface IChatMessageTextArea {
    isAwaitingMessageFromOpenAi: boolean;
    textInTextArea: string;
    handleChangesInTextArea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleEnterSubmission: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleSubmitIconClick: () => void;
}

export default function ChatMessageTextArea({
    isAwaitingMessageFromOpenAi, textInTextArea, handleChangesInTextArea, handleEnterSubmission, handleSubmitIconClick
}: IChatMessageTextArea) {
    return (
        <div className='flex flex-col items-center w-auto pb-0 md:pb-12 pt-2 h-200p md:h-auto'>
            {isAwaitingMessageFromOpenAi ? <BouncingDots /> : <></>}
            <div className='flex items-center flex-1 w-full leading-8 pr-8'>
                {/* Input field  */}
                <textarea id="chatboxTextInput"
                    className={`bg-white shadow-lg border-2 border-stone-300 w-full h-auto ml-5 mr-3 font-dmsans text-neutral-text-gray
                   pl-5 pt-3 pr-5 pb-3 focus:outline-stone-500 align-middle leading-6 rounded-lg`}
                    style={{ verticalAlign: 'middle', overflowY: 'auto', resize: 'none' }}
                    placeholder="Ask your question here"
                    value={textInTextArea}
                    onChange={handleChangesInTextArea}
                    onKeyDown={handleEnterSubmission}
                    disabled={isAwaitingMessageFromOpenAi}
                ></textarea>
                {/* Send button */}
                <button className={'ml-2'} onClick={handleSubmitIconClick}>
                    <BiSend className='text-3xl cursor-pointer text-stone-500 hover:text-stone-300' />
                </button>
            </div>
        </div>
    )
}