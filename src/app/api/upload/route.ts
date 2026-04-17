import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || 'media';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Prepare file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // 2. Perform upload via Service Role client (bypasses RLS/Signatures)
    const supabase = getServiceRoleClient();
    
    // Convert File to ArrayBuffer for Supabase Upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('API Upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error('Internal upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
