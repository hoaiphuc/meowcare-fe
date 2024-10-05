import { Button } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CatKnowledge = () => {

    return (
        <div className=' w-[1253px] my-10 flex flex-col items-center'>
            <div className='text-[28px] font-semibold mb-10'>Kiến thức cơ bản về ngôn ngữ mèo cần biết</div>
            <div className='flex flex-col justify-start items-start text-[16px] font-semibold text-secondary gap-3'>
                <h1 className='text-[22px] font-semibold text-text'>Ngôn ngữ nói của mèo</h1>
                <h2>Mèo không có ngôn ngữ nói như con người, nhưng chúng sử dụng một loạt các âm thanh và tiếng kêu để giao tiếp với nhau và với con người. Dưới đây là một số âm thanh và tiếng kêu phổ biến mà mèo sử dụng để thể hiện ý định và tâm trạng của mình:</h2>
                <h2><span className='text-text'>Tiếng rên:</span> Đây là một âm thanh êm dịu và thư giãn, thường được mèo phát ra khi chúng cảm thấy hạnh phúc và thoải mái. Một mèo có thể rên khi được vuốt ve hoặc khi nằm gọn trong vòng tay của chủ nhân.</h2>
                <h2><span className='text-text'>Tiếng gầm:</span> Tiếng gầm thường là dấu hiệu của sự tức giận hoặc căng thẳng. Mèo có thể gầm khi chúng cảm thấy xâm phạm hoặc khi chúng muốn bảo vệ lãnh thổ của mình.</h2>
                <h2><span className='text-text'>Tiếng hét:</span> Đây là một tiếng kêu mạnh mẽ và đầy sức mạnh, thường được mèo sử dụng để yêu cầu sự chú ý hoặc khi chúng cảm thấy bị đe dọa.</h2>
                <h2><span className='text-text'>Tiếng kêu:</span> Mèo có thể phát ra các tiếng kêu khác nhau để thể hiện nhu cầu của mình, bao gồm tiếng kêu để yêu cầu thức ăn, tiếng kêu để yêu cầu ra ngoài, và tiếng kêu để thể hiện sự cô đơn hoặc mong muốn giao tiếp.</h2>
            </div>
            <Image src='/besitter/ngon-ngu-co-the.jpg' alt='' width={700} height={467} className='pt-10' />
            <h1 className='text-[18px] font-semibold py-3'>Ngôn ngữ nói của mèo</h1>
            <div className='flex flex-col justify-start items-start text-[16px] font-semibold text-secondary gap-3'>
                <h1 className='text-[22px] font-semibold text-text'>Ngôn ngữ cơ thể của mèo</h1>
                <h2>Ngôn ngữ cơ thể của mèo là một phần quan trọng của cách chúng giao tiếp và thể hiện tâm trạng. Dưới đây là một số biểu hiện cơ thể phổ biến của mèo và ý nghĩa của chúng:</h2>
                <h2><span className='text-text'>Đuôi:</span> Đuôi của mèo có thể biểu hiện nhiều tâm trạng khác nhau. Đuôi cao và cong lên thường biểu hiện sự hạnh phúc hoặc niềm vui, trong khi đuôi gập xuống có thể là dấu hiệu của sự căng thẳng hoặc sợ hãi. Mèo cũng có thể làm đuôi rung lắc để thể hiện sự hứng thú hoặc sự lo lắng.</h2>
                <h2><span className='text-text'>Tai:</span> Khi tai của mèo hướng về phía trước và giữa, đó thường là dấu hiệu của sự chú ý và sự quan tâm. Khi tai hướng về phía sau hoặc đang rung lắc, đó có thể là dấu hiệu của sự lo lắng hoặc sự căng thẳng.</h2>
                <h2><span className='text-text'>Mắt:</span> Mắt của mèo có thể nói lên nhiều điều về tâm trạng của chúng. Mèo thường có mắt to và sáng khi chúng cảm thấy hứng khởi hoặc quan tâm. Mắt hẹp lại và miệng mở ra thường là dấu hiệu của sự lo lắng hoặc căng thẳng.</h2>
                <h2><span className='text-text'>Hành động và vị trí cơ thể:</span> Mèo có thể sử dụng hành động như cúi đầu, nhấc chân hoặc khuỵu gối để thể hiện sự yêu thương và sự gắn bó. Đồng thời, mèo cũng có thể nhảy lên bàn, cào gỗ hoặc trèo lên đồ đạc để thể hiện sự khao khát sự chú ý hoặc sự phản đối.</h2>
            </div>
            <Image src='/besitter/meobietnoi.png' alt='' width={700} height={467} className='pt-10' />
            <h1 className='text-[18px] font-semibold py-3'>Ngôn ngữ cơ thể của loài mèo</h1>

            <h1 className='text-[20px] font-semibold py-10 text-center'>Bạn tự tin hiểu rõ về mèo cưng? Hãy thử sức với bài kiểm tra của chúng tôi để kiểm tra kiến thức của bạn!</h1>

            <Button as={Link} href='/besitter/quizstart'>Bắt đầu bài kiểm tra</Button>
        </div>
    )
}

export default CatKnowledge