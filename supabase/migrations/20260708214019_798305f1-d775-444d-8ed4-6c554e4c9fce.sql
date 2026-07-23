
CREATE POLICY "player_media_owner_all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'player-media' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'player-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "player_media_recruiter_admin_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'player-media' AND (public.is_approved_recruiter(auth.uid()) OR public.has_role(auth.uid(), 'admin')));
