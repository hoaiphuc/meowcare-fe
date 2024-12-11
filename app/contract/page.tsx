'use client';

import { useState, useRef } from "react";
import { Button, Card, Avatar } from "@nextui-org/react";
import SignatureCanvas from "react-signature-canvas";

const ContractPage = () => {
    const [signature, setSignature] = useState<string | null>(null);

    const signaturePadRef = useRef<SignatureCanvas | null>(null);

    const handleClearSignature = () => {
        signaturePadRef.current?.clear();
        setSignature(null);
    };

    const handleSaveSignature = () => {
        const signatureData = signaturePadRef.current
            ?.getTrimmedCanvas()
            .toDataURL("image/png");
        setSignature(signatureData || null);
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex bg-gray-100 w-[1200px] h-[850px]">
                {/* Left: PDF Viewer */}
                <div className="w-[800px] border-r border-gray-300 relative flex items-center justify-center">
                    {signature && (
                        <Avatar
                            radius="none"
                            src={signature}
                            alt="Signature preview"
                            className=" absolute w-[100px] h-[100px] bg-transparent z-10 bottom-0 right-0 mr-[60px] mb-[25px] object-contain"
                        />
                    )}
                    <Avatar
                        radius="none"
                        src="/contract.jpg"
                        className="h-[800px] w-[700px] shadow-lg"
                    />
                </div>
                {/* Right: Signature Space */}
                <div className="w-[300px] p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-700">Ký tên tại đây</h2>
                    <Card className="h-[300px] w-[300px] shadow-lg border-dashed border-gray-300">
                        <SignatureCanvas
                            ref={(ref) => {
                                signaturePadRef.current = ref;
                            }}
                            penColor="black"
                            canvasProps={{
                                width: 300,
                                height: 300,
                                className: "w-[300px] h-[300px]"
                            }}
                        />
                    </Card>
                    <div className="mt-4 flex gap-4">
                        <Button color="primary" className="bg-cyan-500 text-white" onClick={handleSaveSignature}>

                            Xác nhận
                        </Button>
                        <Button color="danger" className="bg-red-500 text-white" onClick={handleClearSignature}>
                            Ký lại
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractPage;
